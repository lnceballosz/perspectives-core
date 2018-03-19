module Perspectives.Identifiers
( deconstructPrefix
, deconstructLocalNameFromCurie
, deconstructLocalNameFromDomeinURI
, deconstructNamespace
, getFirstMatch
, getSecondMatch
, Namespace
, LocalName
, roleIndexNr
, escapeCouchdbDocumentName
, isInNamespace
, isSubNamespace
, isQualifiedWithDomein
, ModelName(..)
, QualifiedName(..)
, class PerspectEntiteitIdentifier
, pe_namespace
, pe_localName
, PEIdentifier
, Prefix
, isUserURI
, isUserEntiteitID
  )

where
import Data.Array (index, unsafeIndex)
import Data.Maybe (Maybe(..), maybe)
import Data.String (Pattern(..), Replacement(..), contains, replaceAll, stripPrefix)
import Data.String.Regex (Regex, match, test)
import Data.String.Regex.Flags (noFlags)
import Data.String.Regex.Unsafe (unsafeRegex)
import Partial.Unsafe (unsafePartial)
import Prelude (class Show, id, not, ($), (<>), (==), (||))

-- | A Namespace has the form "model:Name"
type Namespace = String
type LocalName = String
type Prefix = String

type PEIdentifier = String

-- | Only a psp:Context can have a ModelName. In other words, if something has a ModelName, its pspType is psp:Context.
-- | However, a psp:Context may have a QualifiedName!
newtype ModelName = ModelName Namespace

instance showModelName :: Show ModelName where
  show (ModelName mn) = mn

-- | A QualifiedName consists of a namespace and a local name.
data QualifiedName = QualifiedName Namespace LocalName

instance showQualifiedName :: Show QualifiedName where
  show (QualifiedName mn ln) = mn <> "$" <> ln

-----------------------------------------------------------
-- CLASS PERSPECTENTITEITIDENTIFIER
-----------------------------------------------------------
-- | Abstracts over identifiers for Perspect, used in the CRL parser. There are two instances: ModelName and QualifiedName.
class PerspectEntiteitIdentifier a where
  pe_namespace :: a -> Namespace
  pe_localName :: a -> Maybe LocalName

instance peIdentifierModelName :: PerspectEntiteitIdentifier ModelName where
  pe_namespace (ModelName ns) = ns
  pe_localName _ = Nothing

instance peIdentifierQualifiedName :: PerspectEntiteitIdentifier QualifiedName where
  pe_namespace (QualifiedName ns _) = ns
  pe_localName (QualifiedName _ ln) = Just ln

-----------------------------------------------------------
-- DECONSTRUCTING NAMESPACES
-----------------------------------------------------------
domeinURIQualifiedRegex :: Regex
domeinURIQualifiedRegex = unsafeRegex "^model:(\\w*)(.*)$" noFlags

-- | Is the identifier qualified with a valid Namespace?
isQualifiedWithDomein :: String -> Boolean
isQualifiedWithDomein s = test domeinURIQualifiedRegex s

namespaceRegex :: Regex
namespaceRegex = unsafeRegex "^(model:\\w*)" noFlags

-- | Returns the Namespace part of an identifier or Nothing.
deconstructNamespace :: String -> Maybe Namespace
deconstructNamespace = getFirstMatch namespaceRegex

domeinURIRegex :: Regex
domeinURIRegex = unsafeRegex "^model:(\\w*)\\$(\\w*)$" noFlags

-- | Returns "localName" from "model:ModelName$localName" or Nothing
deconstructLocalNameFromDomeinURI :: String -> Maybe String
deconstructLocalNameFromDomeinURI = getSecondMatch domeinURIRegex

-----------------------------------------------------------
-- CURIES
-----------------------------------------------------------
curieRegEx :: Regex
curieRegEx = unsafeRegex "^(\\w+)\\:(\\w+)" noFlags

-- | Returns 'pre' from 'pre:someurl' or Nothing.
deconstructPrefix :: String -> Maybe Prefix
deconstructPrefix = getFirstMatch curieRegEx

-- | Returns "someurl" from "pre:someurl" or Nothing
deconstructLocalNameFromCurie :: String -> Maybe String
deconstructLocalNameFromCurie = getSecondMatch curieRegEx

-----------------------------------------------------------
-- THE MODEL:USER DOMEIN
-----------------------------------------------------------
userCurieRegEx :: Regex
userCurieRegEx = unsafeRegex "^usr:" noFlags

-- | True iff the string starts on "usr:"
isUserCurie :: String -> Boolean
isUserCurie = test userCurieRegEx

userUriRegEx :: Regex
userUriRegEx = unsafeRegex "^model:User\\$" noFlags

-- | True iff the string starts on "model:User$"
isUserURI :: String -> Boolean
isUserURI = test userUriRegEx

isUserEntiteitID :: String -> Boolean
isUserEntiteitID id = isUserURI id || isUserURI id

-----------------------------------------------------------
-- ROLNAMES
-----------------------------------------------------------
roleIndexNrRegex :: Regex
roleIndexNrRegex = unsafeRegex "_(\\d+)$" noFlags

-- | Role names are postfixed with an index to distinghuish between multiple occurrences of the same role type.
roleIndexNr :: String -> Maybe String
roleIndexNr s = case match roleIndexNrRegex s of
  (Just (matches :: Array (Maybe String))) -> maybe Nothing id (index matches 1)
  _ -> Nothing

-----------------------------------------------------------
-- ESCAPING FOR RETRIEVAL FROM COUCHDB
--  Couchdb accepts documentnames with ":" en "$" prima. But to retrieve them through http, these
--  characters have to be escaped.
-----------------------------------------------------------

escapeCouchdbDocumentName :: String -> String
escapeCouchdbDocumentName s = replaceAll (Pattern ":") (Replacement "%3A") (replaceAll (Pattern "$") (Replacement "%24") s)

-- | ident is in ns iff the namespace part of ident equals ns.
-- | E.g. model:Perspectives$Aangifte$Aangever is in the namespace model:Perspectives$Aangifte$.
isInNamespace :: String -> String -> Boolean
isInNamespace ns ident =
  -- A quick test: strip ns from ident. What remains may not hold a "$".
  ns == ident ||
    (not $ contains (Pattern "$") (maybe "$" id (stripPrefix (Pattern (ns <> "$")) ident)))

isSubNamespace :: String -> String -> Boolean
isSubNamespace ns ident = contains (Pattern ns) ident

-----------------------------------------------------------
-- REGEX MATCHING HELPER FUNCTIONS
-----------------------------------------------------------
getFirstMatch :: Regex -> String -> Maybe String
getFirstMatch regex s = case match regex s of
  (Just matches) -> unsafePartial unsafeIndex matches 1
  _ -> Nothing

getSecondMatch :: Regex -> String -> Maybe String
getSecondMatch regex s = case match regex s of
  (Just matches) -> unsafePartial unsafeIndex matches 2
  _ -> Nothing