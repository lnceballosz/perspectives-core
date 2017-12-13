module Perspectives.Syntax where

import Data.Maybe (Maybe)
import Data.StrMap (StrMap)
import Prelude (class Show, show, (<>))

type ID = String

type Comment = String

newtype Comments e = Comments
  { commentBefore :: Array Comment
  , commentAfter :: Array Comment
  | e}

type PropertyComments = Comments ()
type ContextRoleComments = Comments (propertyComments :: StrMap (Comments ()))

newtype PerspectContext = PerspectContext
  { id :: ID
  , pspType :: ID
  , binnenRol :: BinnenRol
  , buitenRol :: ID
  , rolInContext :: Array ID
  , comments :: ContextRoleComments
  }

newtype PerspectRol =
  PerspectRol
    { id :: ID
    , pspType :: ID
    , binding :: Maybe ID
    , context :: ID
    , properties :: StrMap (Array String)
    , gevuldeRollen :: StrMap (Array ID)
    , comments :: ContextRoleComments
    }

newtype BinnenRol =
  BinnenRol
    { id :: ID
    , pspType :: ID
    , binding :: Maybe ID
    , properties :: StrMap (Array String)
    , comments :: ContextRoleComments
    }

type PerspectName = String
type PropertyName = String
type RoleName = String

data TextDeclaration = TextDeclaration PerspectName (Array Comment)

data ContextDeclaration = ContextDeclaration PerspectName PerspectName (Array Comment)

data SimpleValue =
    String String
  | Int Int
  | Bool Boolean
  -- en dan nog date


-----------------------------------------------------------
-- Show instances
-----------------------------------------------------------

foreign import jsonStringify :: forall a. {|a} -> String

instance showPerspectContext :: Show PerspectContext where
  show (PerspectContext r) = jsonStringify r

instance showPerspectRol :: Show PerspectRol where
  show (PerspectRol r) = jsonStringify r

instance showSimpleValue :: Show SimpleValue where
  show (String s) = show s
  show (Int i) = show i
  show (Bool b) = show b

instance showTypeDeclaration :: Show ContextDeclaration where
  show (ContextDeclaration tp inst cmt) = tp <> "=" <> inst <> show cmt

instance showComments :: Show (Comments e) where
  show (Comments {commentBefore, commentAfter}) = "commentBefore: " <> show commentBefore <> "\ncommentAfter: " <> show commentAfter
