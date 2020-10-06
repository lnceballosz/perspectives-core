-- Copyright Joop Ringelberg and Cor Baars, 2020
domain: ModelManagement
  use: sys for model:System
  use: mm for model:ModelManagement
  use: p for model:Parsing

  -- The model description case.
  case: Model
    external:
      aspect: sys:Model$External
    aspect: sys:Model

  case: ModelManagementApp
    external:
      aspect: sys:RootContext$External
    aspect: sys:RootContext
    indexed: mm:MyManagedModels

    context: Models filledBy: ManagedModel

    user: Manager filledBy: sys:User

  case: ManagedModel
    external:
      property: ArcPath (mandatory, functional, String)
      property: ArcFeedback (mandatory, functional, String)
      property: ArcOK = ArcFeedback == "OK"
      property: CrlPath (mandatory, functional, String)
      property: CrlFeedback (mandatory, functional, String)
      property: CrlOK = CrlFeedback == "OK"
      property: Name (mandatory, functional, String)

    thing: Repository (mandatory, functional)
      property: Url (mandatory, functional, String)

    context: ModelDescription (not mandatory, functional) filledBy: sys:Model

    user: Author (mandatory, functional) filledBy: Manager
      perspective on: External
      perspective on: ModelDescription
      perspective on: Repository

    bot: for Author
      perspective on: External
        if extern >> ((exists ArcPath) and not exists ArcFeedback) then
          ArcFeedback = extern >> callExternal p:ParseAndCompileArc( ArcPath ) returns: String
    bot: for Author
      perspective on: External
        if extern >> ((exists CrlPath) and not exists CrlFeedback) then
          CrlFeedback = extern >> callExternal p:ParseAndCompileCrl( CrlPath ) returns: String
    bot: for Author
      perspective on: External
        if extern >> (ArcOK and CrlOK) then
          callEffect p:UploadToRepository( extern >> ArcPath, extern >> CrlPath, Repository >> Url )