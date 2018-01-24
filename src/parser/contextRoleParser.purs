module Perspectives.ContextRoleParser where

import Perspectives.IndentParser
import Control.Alt ((<|>))
import Control.Monad.State (get, gets)
import Control.Monad.Trans.Class (lift)
import Data.Array (dropEnd, intercalate)
import Data.Array (cons, many, snoc, length) as AR
import Data.Char.Unicode (isLower)
import Data.Foldable (elem, fold)
import Data.List.Types (List(..))
import Data.Maybe (Maybe(..), maybe)
import Data.StrMap (StrMap, empty, fromFoldable, insert, lookup)
import Data.String (Pattern(..), fromCharArray, split)
import Data.Tuple (Tuple(..))
import Perspectives.ContextAndRole (createPerspectRol)
import Perspectives.Resource (storeContextInResourceDefinitions, storeRoleInResourceDefinitions)
import Perspectives.ResourceTypes (DomeinFileEffects)
import Perspectives.Syntax (Comment, Comments(..), ContextDeclaration(..), Expanded(..), ID, PerspectContext(..), PropertyName, PropertyValueWithComments, RoleName, SimpleValue(..), EnclosingContextDeclaration(..))
import Perspectives.Token (token)
import Prelude (Unit, bind, discard, id, pure, show, unit, ($), ($>), (*>), (+), (-), (/=), (<$>), (<*), (<*>), (<>), (==), (>))
import Text.Parsing.Indent (block, checkIndent, indented, sameLine, withPos)
import Text.Parsing.Parser (ParseState(..), fail)
import Text.Parsing.Parser.Combinators (choice, option, optionMaybe, try, (<?>), (<??>))
import Text.Parsing.Parser.Pos (Position(..))
import Text.Parsing.Parser.String (char, satisfy, whiteSpace)
import Text.Parsing.Parser.String (anyChar, oneOf, string) as STRING
import Text.Parsing.Parser.Token (alphaNum, upper)

-----------------------------------------------------------
-- Comments
-----------------------------------------------------------

inLineComment :: forall e. IP (Array Comment) e
inLineComment = option [] do
  sameLine
  _ <- (STRING.string "--")
  chars <- AR.many (satisfy (_ /= '\n'))
  _ <- whiteSpace
  pure [fromCharArray chars]

manyOneLineComments :: forall e. IP (Array Comment) e
manyOneLineComments = AR.many
    (fromCharArray <$> ((STRING.string "--") *> (AR.many (satisfy (_ /= '\n')) <* whiteSpace)))

-----------------------------------------------------------
-- Identifiers
-----------------------------------------------------------

reservedOp :: forall e. String -> IP Unit e
reservedOp = token.reservedOp

reserved :: forall e. String -> IP Unit e
reserved = token.reserved

identifier :: forall e. IP String e
identifier = token.identifier

lexeme :: forall a e. IP a e -> IP a e
lexeme = token.lexeme

int :: forall e. IP SimpleValue e
int = Int <$> token.integer

bool :: forall e. IP SimpleValue e
bool = reserved "true" $> Bool true <|> reserved "false" $> Bool false

string :: forall e. IP SimpleValue e
string = String <$> token.stringLiteral

simpleValue :: forall e. IP SimpleValue e
simpleValue = string <|> int <|> bool

identLetter :: forall e. IP Char e
identLetter = alphaNum <|> STRING.oneOf ['_', '\'']

identLetterString :: forall e. IP String e
identLetterString = fromCharArray <$> AR.many identLetter

-- /([A-Z]\w*\b)/
-- /(\p{Uppercase}[\p{Alphabetic}\p{Mark}\p{Decimal_Number}\p{Connector_Punctuation}\p{Join_Control}]+)/gu
capitalizedString :: forall e. IP String e
capitalizedString = f <$> upper <*> AR.many identLetter where
  f c ca = fromCharArray $ AR.cons c ca

lower :: forall e. IP Char e
lower = satisfy isLower <?> "uppercase letter"

-- /([a-z]\w*\b)/
-- /(\b\p{Lowercase}[\p{Alphabetic}\p{Mark}\p{Decimal_Number}\p{Connector_Punctuation}\p{Join_Control}]+\b)/gu
uncapitalizedString :: forall e. IP String e
uncapitalizedString = f <$> lower <*> AR.many identLetter where
  f c ca = fromCharArray $ AR.cons c ca

-- domeinName = 'model:' upper alphaNum* '$'
domeinName :: forall e. IP String e
domeinName = do
  _ <- STRING.string "model:"
  domein <- capitalizedString
  _ <- char '$'
  pure $ "model:" <> domein <> "$"

standaloneDomeinName :: forall e. IP Expanded e
standaloneDomeinName = lexeme do
  dn <- domeinName
  pure $ Expanded dn ""

-- localContextName = upper alphaNum*
localContextName :: forall e. IP String e
localContextName = f <$> identLetterString <*> AR.many (defaultEmbedded identLetterString) where
  f first rest = fold $ AR.cons first rest

defaultEmbedded :: forall e. IP String e -> IP String e
defaultEmbedded p = (<>) <$> STRING.string "$" <*> p

-- localPropertyName = lower alphaNum*
localPropertyName :: forall e. IP String e
localPropertyName = uncapitalizedString

-- prefix = lower+ ':'
prefix :: forall e. IP String e
prefix = (f <$> lower <*> AR.many lower <*> char ':') where
  f fst ca c = fromCharArray $ AR.cons fst (AR.snoc ca c)

prefixedName :: forall e. IP String e -> IP Expanded e
prefixedName localName = lexeme do
  pre <- prefix
  ln <- localName
  namespace <- getPrefix pre
  case namespace of
    Nothing -> fail $ "The prefix '" <> pre <> "' has not been declared!"
    (Just ns) -> pure $ Expanded ns ln

-- prefixedContextName = prefix localContextName
prefixedContextName :: forall e. IP Expanded e
prefixedContextName = prefixedName localContextName

-- prefixedPropertyName = prefix localPropertyName
prefixedPropertyName :: forall e. IP Expanded e
prefixedPropertyName = prefixedName localPropertyName

-- qualifiedResourceName = domeinName localContextName
expandedContextName :: forall e. IP Expanded e
expandedContextName = try $ lexeme (Expanded <$> domeinName <*> localContextName)

-- expandedPropertyName = domeinName localPropertyName
expandedPropertyName :: forall e. IP Expanded e
expandedPropertyName = lexeme (Expanded <$> domeinName <*> localPropertyName)

defaultNamespacedContextName :: forall e. IP Expanded e
defaultNamespacedContextName = lexeme do
  namespace <- getNamespace
  namespaceLevels <- AR.length <$> AR.many (STRING.string "$")
  localName <- localContextName
  namespace' <- (butLastNNamespaceLevels namespace (namespaceLevels - 1))
  pure $ Expanded namespace' localName
  where
    butLastNNamespaceLevels :: String -> Int -> IP String e
    butLastNNamespaceLevels _ -1 = fail "local name starting with '$'."
    butLastNNamespaceLevels ns 0 = pure ns
    butLastNNamespaceLevels ns n = do
      -- segments will have a last segment that is an empty string, because namespaces end in "$".
      segments <- pure (split (Pattern "$") ns)
      if (n - 2) > (AR.length segments)
        then fail "too many levels up"
        else pure $ (intercalate "$" (dropEnd (n + 1) segments)) <> "$"

-- cname = prefixedContextName | expandedContextName
contextName :: forall e. IP Expanded e
contextName = (expandedContextName <|> standaloneDomeinName <|> prefixedContextName <|> defaultNamespacedContextName) <?> "the name of a resource (Context or Role)."

-- propertyName = prefixedPropertyName | expandedPropertyName
propertyName :: forall e. IP Expanded e
propertyName = (expandedPropertyName <|> prefixedPropertyName) <?> "a property or role name."

roleName :: forall e. IP Expanded e
roleName = propertyName

-----------------------------------------------------------
-- Datatypes
-----------------------------------------------------------
dataTypes :: Array String
dataTypes = ["Number", "String", "Bool", "Date"]

dataType :: forall e. IP SimpleValue e
dataType = try do
  s <- identifier
  if elem s dataTypes then pure $ String s else fail "one of 'Number', 'String', 'Bool' or 'Date'."

-----------------------------------------------------------
-- Handling position
-----------------------------------------------------------

-- | @ getPosition @ returns current position
-- | should probably be added to Text.Parsing.Parser.Pos
getPosition :: forall e. IP Position e
getPosition = gets \(ParseState _ pos _) -> pos

sourceColumn :: Position -> Int
sourceColumn (Position {line: _, column: c}) = c

sourceLine :: Position -> Int
sourceLine (Position {line: l, column: _}) = l

-- | Parses only on the next line as the reference
nextLine :: forall e. IP Unit e
nextLine = do
    pos <- getPosition
    s   <- lift get
    if sourceLine s + 1 == sourceLine pos then pure unit else fail "not on next line"

-----------------------------------------------------------
-- Elementary expression types
-----------------------------------------------------------

-- | enclosingContextDeclaration = contextName contextName
enclosingContextDeclaration :: forall e. IP EnclosingContextDeclaration e
enclosingContextDeclaration = (do
  cname <- (reserved "Context" *> contextName)
  _ <- setNamespace $ (show cname) <> "$"
  prfx <- (optionMaybe (reserved "als" *> prefix <* whiteSpace))
  cmt <- inLineComment
  case prfx of
    Nothing -> pure unit
    (Just pre) -> setPrefix pre (show cname)
  pure $ EnclosingContextDeclaration cname cmt) <?> "the context declaration: Context <name>."

-- | contextDeclaration = contextName contextName
contextDeclaration :: forall e. IP ContextDeclaration e
contextDeclaration = (ContextDeclaration <$> contextName <*> contextName <*> inLineComment) <?> "a type declaration, e.g. :ContextType :ContextName."

-- | Apply to a single line parser. Will parse a block of contiguous line comments before the line and
-- | the comment after the expression on the line.
withComments :: forall e a. IP a e -> IP (Tuple (Comments ()) a) e
withComments p = do
  before <- manyOneLineComments
  withPos do
    a <- p
    after <- inLineComment
    pure $ Tuple (Comments{ commentBefore: before, commentAfter: after}) a

typedPropertyAssignment :: forall e. IP Unit e -> IP (Tuple ID PropertyValueWithComments) e
typedPropertyAssignment scope = go (try (withComments
  (withPos
    (Tuple
      <$> (scope *> (propertyName <* (sameLine *> reservedOp "=")))
      <*> (sameLine *> (simpleValue <|> dataType))))))
  where
    go x = do
      (Tuple (Comments {commentBefore, commentAfter}) (Tuple pname value)) <- x
      pure $ Tuple (show pname) (Comments {value: [show value], commentBefore: commentBefore, commentAfter: commentAfter})

-- | publicContextPropertyAssignment = 'extern' propertyName '=' simpleValue
publicContextPropertyAssignment :: forall e. IP (Tuple ID PropertyValueWithComments) e
publicContextPropertyAssignment = (typedPropertyAssignment (reserved "extern")) <?> "extern propertyname = value"

-- | privateContextPropertyAssignment = 'intern' propertyName '=' simpleValue
privateContextPropertyAssignment :: forall e. IP (Tuple ID PropertyValueWithComments) e
privateContextPropertyAssignment = (typedPropertyAssignment (reserved "intern")) <?> "intern propertyname = value"

-- | rolePropertyAssignment = propertyName '=' simpleValue
rolePropertyAssignment :: forall e. IP (Tuple ID PropertyValueWithComments) e
rolePropertyAssignment = (typedPropertyAssignment (pure unit)) <?> "intern propertyname = value"

isRoleDeclaration :: forall e. IP Unit (DomeinFileEffects e)
isRoleDeclaration = withPos (roleName *> (sameLine *> optionMaybe roleOccurrence) *> (sameLine *> reservedOp "=>") *> pure unit)

roleOccurrence :: forall e. IP Int e
roleOccurrence = token.parens token.integer

roleBinding' :: forall e.
  Expanded
  -> IP (Tuple (Array Comment) ID) (DomeinFileEffects e)
  -> IP (Tuple RoleName ID) (DomeinFileEffects e)
roleBinding' cname p = ("rolename => contextName" <??>
  (try do
    -- Parsing
    cmtBefore <- manyOneLineComments
    withPos do
      rname@(Expanded _ localRoleName) <- roleName
      occurrence <- sameLine *> optionMaybe roleOccurrence -- The sequence number in text
      _ <- (sameLine *> reservedOp "=>")
      (Tuple cmt binding) <- p
      props <- option Nil (indented *> (block (checkIndent *> rolePropertyAssignment)))
      _ <- incrementRoleInstances localRoleName

      -- Naming
      nrOfRoleOccurrences <- getRoleOccurrences localRoleName -- The position in the sequence.
      rolId <- pure ((show cname) <> localRoleName <> "_" <> (show (roleIndex occurrence nrOfRoleOccurrences)))

      -- Storing
      liftAffToIP $ storeRoleInResourceDefinitions rolId
        (createPerspectRol
          { id: rolId
          , occurrence: (roleIndex occurrence nrOfRoleOccurrences)
          , pspType: show rname
          , binding: Just binding
          , context: show cname
          , properties: fromFoldable ((\(Tuple en cm) -> Tuple (show en) cm) <$> props)
          , comments: Comments { commentBefore: cmtBefore, commentAfter: cmt }
          })
      pure $ Tuple (show rname) rolId))
  where
    -- If there is an index in the text, it prevails.
    roleIndex :: Maybe Int -> Maybe Int -> Int
    roleIndex nrInText nrInSequence = case nrInText of
      (Just n) -> n
      Nothing -> case nrInSequence of
        (Just n) -> n
        Nothing -> 0

-- | The inline context may itself use a defaultNamespacedContextName name. However,
-- | what is returned from the context parser is an ExpandedQN.
roleBindingWithInlineContext :: forall e. Expanded
  -> IP (Tuple RoleName ID) (DomeinFileEffects e)
roleBindingWithInlineContext cName = roleBinding' cName do
  cmt <- inLineComment
  _ <- nextLine
  (contextBuitenRol :: ID) <- indented *> context
  pure $ Tuple cmt contextBuitenRol

-- | The reference may be defaultNamespacedContextName.
roleBindingWithReference :: forall e. Expanded
  -> IP (Tuple RoleName ID) (DomeinFileEffects e)
roleBindingWithReference cName = roleBinding' cName do
  (ident :: Expanded) <- (sameLine *> contextName)
  cmt <- inLineComment
  pure $ Tuple cmt ((show ident) <> "_buitenRol")

-- | roleBinding = roleName '=>' (contextName | context) rolePropertyAssignment*
roleBinding :: forall e. Expanded
  -> IP (Tuple RoleName ID) (DomeinFileEffects e)
roleBinding cname = roleBindingWithInlineContext cname <|> roleBindingWithReference cname -- TODO: query, noBinding

withRoleCounting :: forall a e. IP a e -> IP a e
withRoleCounting p = do
  roleInstances <- getRoleInstances
  setRoleInstances empty
  r <- p
  setRoleInstances roleInstances
  pure r

-----------------------------------------------------------
-- Context
-----------------------------------------------------------
-- | context = contextDeclaration
-- | publicContextPropertyAssignment*
-- | privateContextPropertyAssignment*
-- | roleBinding*
-- | The parser never backtracks over a Context. This means we can safely perform the side
-- | effect of storing its constituent roles and contexts.
context :: forall e. IP ID (DomeinFileEffects e)
context = withRoleCounting context' where
  context' = do
    -- Parsing
    cmtBefore <- manyOneLineComments
    withPos do
      (ContextDeclaration typeName instanceName@(Expanded dname localName) cmt) <- contextDeclaration

      -- Naming
      extendNamespace (localName <> "$")
        do
          -- Parsing the body
          (publicProps :: List (Tuple ID PropertyValueWithComments)) <- option Nil (indented *> (block publicContextPropertyAssignment))
          (privateProps :: List (Tuple ID PropertyValueWithComments)) <- option Nil (indented *> (block privateContextPropertyAssignment))
          (rolebindings :: List (Tuple RoleName ID)) <- option Nil (indented *> (block $ roleBinding instanceName))

          -- Storing
          liftAffToIP $ storeContextInResourceDefinitions (show instanceName)
            (PerspectContext
              { id: (show instanceName)
              , displayName : localName
              , pspType: show typeName
              , binnenRol:
                createPerspectRol
                  { id: (show instanceName) <> "_binnenRol"
                  , pspType: "model:Perspectives$BinnenRol"
                  , binding: Just $ (show instanceName) <> "_buitenRol"
                  , properties: fromFoldable privateProps
                  }
              , buitenRol: (show instanceName) <> "_buitenRol"
              , rolInContext: collect rolebindings
              , comments: Comments { commentBefore: cmtBefore, commentAfter: cmt}
            })
          liftAffToIP $ storeRoleInResourceDefinitions ((show instanceName) <> "_buitenRol")
            (createPerspectRol
              { id: (show instanceName) <> "_buitenRol"
              , pspType: "model:Perspectives$BuitenRol"
              , context: (show instanceName)
              , properties: fromFoldable publicProps
              })
          pure $ (show instanceName) <> "_buitenRol"
  collect :: List (Tuple RoleName ID) -> StrMap (Array ID)
  collect Nil = empty
  collect (Cons (Tuple rname id) r) = let map = collect r in
    case lookup rname map of
      Nothing -> insert rname [id] map
      (Just ids) -> insert rname (AR.cons id ids) map

-- Helper functions for development.
allTheRest :: forall e. IP String e
allTheRest = fromCharArray <$> (AR.many STRING.anyChar)

-----------------------------------------------------------
-- Expression
-----------------------------------------------------------

expression :: forall e. IP String (DomeinFileEffects e)
expression = choice
  [ try (enclosingContextDeclaration *> (pure "enclosingContextDeclaration"))
  , try (importExpression *> (pure "importExpression"))
  , try (sectionHeading *> (pure "sectionHeading") )
  , try (contextDeclaration *> (pure "contextDeclaration"))
  , try (publicContextPropertyAssignment *> (pure "publicContextPropertyAssignment"))
  , try (privateContextPropertyAssignment *> (pure "privateContextPropertyAssignment"))
  , try (rolePropertyAssignment *> (pure "rolePropertyAssignment"))
  , try (isRoleDeclaration *> (pure "isRoleDeclaration" ))
  , try ((STRING.string "--") *> (pure "oneLineComment"))
  -- query
  ]

-----------------------------------------------------------
-- Section and definition
-----------------------------------------------------------
section :: forall e. IP (Tuple String (Array ID)) (DomeinFileEffects e)
section = do
  prop <- sectionHeading
  ids <- AR.many definition
  pure $ Tuple (show prop) ids

sectionHeading :: forall e. IP ID (DomeinFileEffects e)
sectionHeading = do
  prop <- reserved "Section" *> propertyName
  setSection (show prop)
  pure $ show prop

definition :: forall e. IP ID (DomeinFileEffects e)
definition = do
  binding <- context
  prop <- getSection
  _ <- incrementRoleInstances prop
  nrOfRoleOccurrences <- getRoleOccurrences prop
  enclContext <- getNamespace
  rolId <- pure $ enclContext <> "_" <> prop <> maybe "0" show nrOfRoleOccurrences
  liftAffToIP $ storeRoleInResourceDefinitions rolId
    (createPerspectRol
      { id: rolId
      , occurrence: maybe 0 id nrOfRoleOccurrences
      , pspType: prop
      , binding: Just binding
      , context: enclContext
      })
  pure rolId

-----------------------------------------------------------
-- Import
-----------------------------------------------------------
importExpression :: forall e. IP Unit e
importExpression = do
  ns <- reserved "import" *> contextName
  mpre <- (optionMaybe (reserved "als" *> prefix <* whiteSpace))
  case mpre of
    Nothing -> pure unit
    (Just pre) -> setPrefix pre (show ns)

-----------------------------------------------------------
-- Text
-----------------------------------------------------------
enclosingContext :: forall e. IP ID (DomeinFileEffects e)
enclosingContext = withRoleCounting enclosingContext' where
  enclosingContext' = do
    cmtBefore <- manyOneLineComments
    withPos do
      (EnclosingContextDeclaration textName@(Expanded _ localName) cmt) <- enclosingContextDeclaration
      _ <- AR.many importExpression
      (publicProps :: List (Tuple PropertyName PropertyValueWithComments)) <- (block publicContextPropertyAssignment)
      (privateProps :: List (Tuple PropertyName PropertyValueWithComments)) <- (block privateContextPropertyAssignment)
      defs <- AR.many section
      liftAffToIP $ storeContextInResourceDefinitions (show textName)
        (PerspectContext
          { id: show textName
          , displayName : show textName
          , pspType: "model:Perspectives$enclosingContext"
          , binnenRol:
            createPerspectRol
              { id: (show textName) <> "_binnenRol"
              , pspType: "model:Perspectives$BinnenRol"
              , binding: Just $ (show textName) <> "_buitenRol"
              , properties: fromFoldable privateProps
              }
          , buitenRol: (show textName) <> "_buitenRol"
          , rolInContext: fromFoldable defs
          , comments: Comments { commentBefore: cmtBefore, commentAfter: cmt}
          })

      liftAffToIP $ storeRoleInResourceDefinitions ((show textName) <> "_buitenRol")
        (createPerspectRol
          { id: show textName <> "_buitenRol"
          , pspType: "model:Perspectives$BuitenRol"
          , context: show textName
          , properties: fromFoldable publicProps
          })
      pure $ show textName
