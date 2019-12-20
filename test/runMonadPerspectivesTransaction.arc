domain: Test
  use: sys for model:System

  case: TestCaseContextDelta_context
    user: Self filledBy: sys:PerspectivesSystem$User
    thing: SourceRole filledBy: FillerRole
    thing: SomeRole filledBy: FillerRole
    thing: FillerRole
    bot: for Self
      perspective on: Self
        if true then
          bind SourceRole >> binding to SomeRole
      perspective on: RoleToInspect
        if exists SomeRole then
          Flag = true
    thing: RoleToInspect
      property: Flag (not mandatory, functional, Boolean)

  case: TestCaseContextDelta_rol
    user: UberSelf filledBy: sys:PerspectivesSystem$User
    bot: for UberSelf
      perspective on: UberSelf
        if not (exists NestedContext) then
          bind SourceRole >> binding to NestedContext
    thing: AnotherRole
      property: Prop3 (mandatory, functional, Boolean)
    context: NestedContext filledBy: SubCase
    context: SourceRole filledBy: SubCase
    case: SubCase
      user: Self filledBy: sys:PerspectivesSystem$User
      bot: for Self
        perspective on: RoleToInspect
          if extern >> binder NestedContext >> context >> AnotherRole >> Prop3 then
            Flag = true
      thing: RoleToInspect
        property: Flag (not mandatory, functional, Boolean)

  case: TestCaseRoleDelta_binding
    user: Self filledBy: sys:PerspectivesSystem$User
    bot: for Self
      perspective on: Self
        if true then
          bind_ BindingRole to BinderRole
      perspective on: BinderRole
        if exists (BinderRole >> binding) then
          Flag = true
    thing: BindingRole (not mandatory, functional)
    thing: BinderRole (not mandatory, functional) filledBy: BindingRole
      property: Flag (not mandatory, functional, Boolean)

  case: TestCaseRoleDelta_binder
    user: UberSelf filledBy: sys:PerspectivesSystem$User
    bot: for UberSelf
      perspective on: UberSelf
        if (not exists NestedContext2 >> binding) and (exists SourceRole2 >> binding) then
          bind_ SourceRole2 >> binding to NestedContext2
    thing: AnotherRole
      property: Prop3 (mandatory, functional, Boolean)
    context: NestedContext2 filledBy: SubCase2
    context: SourceRole2 filledBy: SubCase2
    case: SubCase2
      user: Self filledBy: sys:PerspectivesSystem$User
      bot: for Self
        perspective on: RoleToInspect
          if extern >> binder NestedContext2 >> context >> AnotherRole >> Prop3 then
            Flag = true
      thing: RoleToInspect
        property: Flag (not mandatory, functional, Boolean)
