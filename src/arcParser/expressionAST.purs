-- BEGIN LICENSE
-- Perspectives Distributed Runtime
-- Copyright (C) 2019 Joop Ringelberg (joopringelberg@perspect.it), Cor Baars
--
-- This program is free software: you can redistribute it and/or modify
-- it under the terms of the GNU General Public License as published by
-- the Free Software Foundation, either version 3 of the License, or
-- (at your option) any later version.
--
-- This program is distributed in the hope that it will be useful,
-- but WITHOUT ANY WARRANTY; without even the implied warranty of
-- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
-- GNU General Public License for more details.
--
-- You should have received a copy of the GNU General Public License
-- along with this program.  If not, see <https://www.gnu.org/licenses/>.
--
-- Full text of this license can be found in the LICENSE file in the projects root.

-- END LICENSE

-- | An Abstract Syntax Tree data model for Perspectives expressions. The expression grammar is below.
-- |
-- | step = simpleStep | unaryStep | compoundStep | let*
-- |
-- | simpleStep = ArcIdentifier
-- |
-- | | binding
-- |
-- | | binder
-- |
-- | | context
-- |
-- | | extern
-- |
-- | | Value
-- |
-- | | variable
-- |
-- | | this
-- |
-- | | >>= SequenceFunction
-- |
-- | unaryStep =
-- |    'not' step
-- |  | 'createRole' ArcIdentifier
-- |  | 'createContext' ArcIdentifier
-- |  | 'exists' ArcIdentifier
-- |
-- | compoundStep =
-- |    'filter' step 'with' step
-- |  | step operator step
-- |  | 'bind_' step 'in' step
-- |
-- | operator = '>>' | '==' | '<' | '>' | '<=' | '>=' | 'and' | 'or' | '+' | '-' | '*' | '/'
-- |
-- | assignment = ArcIdentifier AssignmentOperator step
-- |
-- | AssignmentOperator = '=' | '=+' | '=-'
-- |
-- | RoleName = ArcIdentifier
-- |
-- | PropertyName = ArcIdentifier
-- |
-- | Value = number | boolean | string | date
-- |
-- | SequenceFunction = 'sum' | 'count' | 'product' | 'minimum' | 'maximum'
-- |
-- |
-- | let* = 'let*' binding+ 'in' body
-- |
-- | binding = variable '<-' step
-- |
-- | body = step | assignment+
-- |
-- | variable = lowerCaseName


module Perspectives.Parsing.Arc.Expression.AST where

import Prelude

import Data.Generic.Rep (class Generic)
import Data.Generic.Rep.Eq (genericEq)
import Data.Generic.Rep.Show (genericShow)
import Data.Maybe (Maybe)
import Foreign.Class (class Decode, class Encode)
import Foreign.Generic (defaultOptions, genericDecode, genericEncode)
import Perspectives.Parsing.Arc.IndentParser (ArcPosition)
import Perspectives.Representation.Range (Range)
import Perspectives.Representation.QueryFunction (FunctionName)

-- | Step represents an Expression conforming to the grammar given above.
data Step = Simple SimpleStep | Binary BinaryStep | Unary UnaryStep | Let LetStep | PureLet PureLetStep

data SimpleStep =
  ArcIdentifier ArcPosition String
  | Value ArcPosition Range String
  | CreateContext ArcPosition String
  | CreateEnumeratedRole ArcPosition String
  | Binding ArcPosition
  | Binder ArcPosition String
  | Context ArcPosition
  | Extern ArcPosition
  | SequenceFunction ArcPosition FunctionName
  | Identity ArcPosition
  | Variable ArcPosition String

data UnaryStep =
  LogicalNot ArcPosition Step
  | Exists ArcPosition Step

newtype BinaryStep = BinaryStep {start :: ArcPosition, end :: ArcPosition, operator :: Operator, left :: Step, right :: Step}

newtype LetStep = LetStep {start :: ArcPosition, end :: ArcPosition, bindings:: Array VarBinding, assignments :: Array Assignment}

newtype PureLetStep = PureLetStep {start :: ArcPosition, end :: ArcPosition, bindings:: Array VarBinding, body :: Step}

data VarBinding = VarBinding String Step

data Operator =
  Compose ArcPosition
  | Equals ArcPosition
  | NotEquals ArcPosition
  | LessThan ArcPosition
  | LessThanEqual ArcPosition
  | GreaterThan ArcPosition
  | GreaterThanEqual ArcPosition
  | LogicalAnd ArcPosition
  | LogicalOr ArcPosition
  | Add ArcPosition
  | Subtract ArcPosition
  | Divide ArcPosition
  | Multiply ArcPosition
  | Filter ArcPosition
  | Sequence ArcPosition

-- newtype Assignment = Assignment {start :: ArcPosition, end :: ArcPosition, lhs :: String, operator :: AssignmentOperator, value :: Maybe Step}

data AssignmentOperator =
  Set ArcPosition
  | AddTo ArcPosition
  | DeleteFrom ArcPosition

type WithTextRange f = {start :: ArcPosition, end :: ArcPosition | f}

data Assignment =
	Remove (WithTextRange (roleExpression :: Step))
	| CreateRole (WithTextRange (roleIdentifier :: String, contextExpression :: Maybe Step))
  | Move (WithTextRange (roleExpression :: Step, contextExpression :: Maybe Step))
  | Bind (WithTextRange (bindingExpression :: Step, roleIdentifier :: String, contextExpression :: Maybe Step))
  | Bind_ (WithTextRange (bindingExpression :: Step, binderExpression :: Step))
  -- TODO: Maybe String voor roleIdentifier. Pas de parser aan.
  | Unbind (WithTextRange (bindingExpression :: Step, roleIdentifier :: Maybe String))
  | Unbind_ (WithTextRange (bindingExpression :: Step, binderExpression :: Step))
  | DeleteRole (WithTextRange (roleExpression :: Step))
  | DeleteProperty (WithTextRange (propertyIdentifier :: String, roleExpression :: Maybe Step))
  | PropertyAssignment (WithTextRange (propertyIdentifier :: String, operator :: AssignmentOperator, valueExpression :: Step, roleExpression :: Maybe Step ))


derive instance genericStep :: Generic Step _
instance showStep :: Show Step where show s = genericShow s
instance eqStep :: Eq Step where eq = genericEq
instance encodeStep :: Encode Step where
  encode = genericEncode defaultOptions
instance decodeStep :: Decode Step where
  decode = genericDecode defaultOptions

derive instance genericSimpleStep :: Generic SimpleStep _
instance showSimpleStep :: Show SimpleStep where show = genericShow
instance eqSimpleStep :: Eq SimpleStep where eq = genericEq
instance encodeSimpleStep :: Encode SimpleStep where
  encode = genericEncode defaultOptions
instance decodeSimpleStep :: Decode SimpleStep where
  decode = genericDecode defaultOptions

derive instance genericBinaryStep :: Generic BinaryStep _
instance showBinaryStep :: Show BinaryStep where show = genericShow
instance eqBinaryStep :: Eq BinaryStep where eq s1 s2 = genericEq s1 s2
instance encodeBinaryStep :: Encode BinaryStep where
  encode q = genericEncode defaultOptions q
instance decodeBinaryStep :: Decode BinaryStep where
  decode q = genericDecode defaultOptions q

derive instance genericUnaryStep :: Generic UnaryStep _
instance showUnaryStep :: Show UnaryStep where show = genericShow
instance eqUnaryStep :: Eq UnaryStep where eq u1 u2 = genericEq u1 u2
instance encodeUnaryStep :: Encode UnaryStep where
  encode q = genericEncode defaultOptions q
instance decodeUnaryStep :: Decode UnaryStep where
  decode q = genericDecode defaultOptions q

derive instance genericLetStep :: Generic LetStep _
instance showLetStep :: Show LetStep where show = genericShow
instance eqLetStep :: Eq LetStep where eq u1 u2 = genericEq u1 u2
instance encodeLetStep :: Encode LetStep where
  encode q = genericEncode defaultOptions q
instance decodeLetStep :: Decode LetStep where
  decode q = genericDecode defaultOptions q

derive instance genericPureLetStep :: Generic PureLetStep _
instance showPureLetStep :: Show PureLetStep where show = genericShow
instance eqPureLetStep :: Eq PureLetStep where eq u1 u2 = genericEq u1 u2
instance encodePureLetStep :: Encode PureLetStep where
  encode q = genericEncode defaultOptions q
instance decodePureLetStep :: Decode PureLetStep where
  decode q = genericDecode defaultOptions q

derive instance genericVarBinding :: Generic VarBinding _
instance showVarBinding :: Show VarBinding where show = genericShow
instance eqVarBinding :: Eq VarBinding where eq = genericEq
instance encodeVarBinding :: Encode VarBinding where
  encode q = genericEncode defaultOptions q
instance decodeVarBinding :: Decode VarBinding where
  decode q = genericDecode defaultOptions q

derive instance genericOperator :: Generic Operator _
instance showOperator :: Show Operator where show = genericShow
instance eqOperator :: Eq Operator where eq = genericEq
instance encodeOperator :: Encode Operator where
  encode = genericEncode defaultOptions
instance decodeOperator :: Decode Operator where
  decode = genericDecode defaultOptions

derive instance genericAssignment :: Generic Assignment _
instance showAssignment :: Show Assignment where show = genericShow
instance eqAssignment :: Eq Assignment where eq = genericEq
instance encodeAssignment :: Encode Assignment where
  encode q = genericEncode defaultOptions q
instance decodeAssignment :: Decode Assignment where
  decode q = genericDecode defaultOptions q

derive instance genericAssignmentOperator :: Generic AssignmentOperator _
instance showAssignmentOperator :: Show AssignmentOperator where show = genericShow
instance eqAssignmentOperator :: Eq AssignmentOperator where eq = genericEq
instance encodeAssignmentOperator :: Encode AssignmentOperator where
  encode = genericEncode defaultOptions
instance decodeAssignmentOperator :: Decode AssignmentOperator where
  decode = genericDecode defaultOptions
