const {
  HttpUtils,
  HttpUtils: { request, successResponse, errorResponse },
  STATUS,
} = require("quickwork-adapter-cli-server/http-library");


const app = {
    name : "clock",
    alias : "clock",
    description : "clock",
    version : "1",
    config : {"authType":"api_key"},
    webhook_verification_required : false,
    internal : false,
    connection : {
        input_fields : () => [
            {
              key : "apiKey",
              name: "API Key",
              controlType : "password",
              required: true,
              type : "string",
              hintText: "Enter API key",
              helpText : "Enter API key",
              isExtendedSchema : false
            }
        ],

        authorization: {
            type: "api_key",

            credentials: (connection) => {
                return connection.input["apiKey"];
            }
        }
    },
    actions : {
      add_tags: {
        description: "Add Tags",
        hint: "Add <b>new tag in your workspace</b> via <b>Clockify</b>",

        input_fields: () => [
          {
            key: "workspaceId",
            name: "Select Workspace",
            hintText: "The workspace in which you want to retrive a list of tags",
            helpText: "The workspace in which you want to retrive a list of tags",
            required: true,
            type: "pickList",
            controlType: "select",
            isExtendedSchema: false,
            dynamicPickList : "workspaces",
            toogleHint: "Select Workspace",
            toogleField : {
              key: "workspaceId_tf",
              name: "Enter Workspace ID",
              hintText: "The workspace in which you want to retrive a list of tags",
              helpText: "The workspace in which you want to retrive a list of tags",
              required: true,
              isExtendedSchema: false,
              type: "string",
              controlType: "text",
              toogleHint: "Enter Workspace ID",
            }
          },
          {
            key: "name",
            name: "Name",
            hintText: "The name of the tag which you want to add to a workspace. E.g, Tag 1.",
            helpText: "The name of the tag which you want to add to a workspace. E.g, Tag 1.",
            required: false,
            type: "string",
            controlType: "text",
            isExtendedSchema: false,
          },
          {
            key: "archived",
            name: "Archived",
            hintText: "The name of the tag with which you want to filter the list of tags. E.g., Tag 1.",
            helpText: "The name of the tag with which you want to filter the list of tags. E.g., Tag 1.",
            required: true,
            type: "boolean",
            controlType: "select",
            isExtendedSchema: false,
          },
        ],

        execute: async (connection, input) => {
          try {
            let postBody = {
              "name" : input.name,
            };

            const url = `https://api.clockify.me/api/v1/workspaces/${input.workspaceId}/tags`;

            // const headers = app.connection.authorization.credentials(connection);
            let headers = {
              "x-api-key" : connection.input.apiKey
            }
            const response = await HttpUtils.request(url, headers, null, HttpUtils.HTTPMethods.POST, postBody);

            if (response.success === true) {
              let responseBody = response.body;
              let tagsObject = {
                "Tag": responseBody,
              };
              return HttpUtils.successResponse(tagsObject);
              // return HttpUtils.successResponse(response.body);
            } else {
              return HttpUtils.errorResponse(response.body, response.statusCode);
            }
          } catch (error) {
            console.log(error);
            return HttpUtils.errorResponse(error.message);
          }
        },

        output_fields: () => [
          {
            "key": "Tag",
            "name": "Tag",
            "hintText": "Tag",
            "helpText": "Tag",
            "isExtendedSchema": false,
            "required": false,
            "type": "array",
            "controlType": "array",
            "as": "object",
            "properties": [
              {
                "key": "id",
                "name": "Id",
                "hintText": "Id",
                "helpText": "Id",
                "isExtendedSchema": false,
                "required": false,
                "type": "string",
                "controlType": "text"
              },
              {
                "key": "name",
                "name": "Name",
                "hintText": "Name",
                "helpText": "Name",
                "isExtendedSchema": false,
                "required": false,
                "type": "string",
                "controlType": "text"
              },
              {
                "key": "workspaceId",
                "name": "Workspace Id",
                "hintText": "Workspace Id",
                "helpText": "Workspace Id",
                "isExtendedSchema": false,
                "required": false,
                "type": "string",
                "controlType": "text"
              },
              {
                "key": "archived",
                "name": "Archived",
                "hintText": "Archived",
                "helpText": "Archived",
                "isExtendedSchema": false,
                "required": false,
                "type": "boolean",
                "controlType": "select",
                "pickList": [
                  [
                    "Yes",
                    true
                  ],
                  [
                    "No",
                    false
                  ]
                ]
              }
            ]
          }
        ],
        sample_output: connection => {},
      },
      list_tags:{
        description: "List tags",
        hint: "Retrive a <b>list of all tags in a workspace</b> via <b>Clockify</b>",

        input_fields: () => [
          // {
          //   key: "workspaceId",
          //   name: "Workspace ID",
          //   hintText: "The workspace in which you want to add new tag",
          //   helpText: "The workspace in which you want to add new tag",
          //   required: true,
          //   type: "pickList",
          //   controlType: "select",
          //   isExtendedSchema: false,
          //   dynamicPickList: "workspaces"
          // },
          {
            key: "workspaceId",
            name: "Select Workspace",
            hintText: "The workspace in which you want to retrive a list of tags",
            helpText: "The workspace in which you want to retrive a list of tags",
            required: true,
            type: "pickList",
            controlType: "select",
            isExtendedSchema: false,
            dynamicPickList : "workspaces",
            toogleHint: "Select Workspace",
            toogleField : {
              key: "workspaceId_tf",
              name: "Enter Workspace ID",
              hintText: "The workspace in which you want to retrive a list of tags",
              helpText: "The workspace in which you want to retrive a list of tags",
              required: true,
              isExtendedSchema: false,
              type: "string",
              controlType: "text",
              toogleHint: "Enter Workspace ID",
            }
          },
          {
            key: "name",
            name: "Name",
            hintText: "Whether you want to display the list of only archived tags or not. If selected No, a list of only active tags will be retrieved.",
            helpText: "Whether you want to display the list of only archived tags or not. If selected No, a list of only active tags will be retrieved.",
            required: false,
            type: "string",
            controlType: "text",
            isExtendedSchema: false,
          },
          {
            key: "archived",
            name: "Archived",
            hintText: "The name of the tag with which you want to filter the list of tags. E.g., Tag 1.",
            helpText: "The name of the tag with which you want to filter the list of tags. E.g., Tag 1.",
            required: false,
            type: "boolean",
            controlType: "select",
            isExtendedSchema: false,
          },
          {
            key: "page",
            name: "Page",
            hintText: "The number of pages you want to retrieve. E.g., 30. The default page value is 1.",
            helpText: "The number of pages you want to retrieve. E.g., 30. The default page value is 1.",
            required: false,
            type: "string",
            controlType: "text",
            isExtendedSchema: false,
          },
          {
            key: "pagesize",
            name: "Page Size",
            hintText: "The number of tags you want to display on a single page. E.g., 70. The default page size value is 50.",
            helpText: "The number of tags you want to display on a single page. E.g., 70. The default page size value is 50.",
            required: false,
            type: "string",
            controlType: "text",
            isExtendedSchema: false,
          }
        ],

        execute : async (connection, input) => {
          try {
            const url = `https://api.clockify.me/api/v1/workspaces/${input.workspaceId}/tags`
            let headers = {
              "x-api-key" : connection.input.apiKey
            }
            const response = await HttpUtils.request(url, headers, null, HttpUtils.HTTPMethods.GET);
            if (response.success === true) {
              // return HttpUtils.successResponse(response.body);
              let responseBody = response.body;
              let tagsObject = {
                "Tags": responseBody,
              };
              return HttpUtils.successResponse(tagsObject);
            } else {
              return HttpUtils.errorResponse(response.body, response.statusCode);
            }
          } catch (error) {
            console.log(error);
            return HttpUtils.errorResponse(error.message);
          } 
        },
        output_fields: () => [
          {
            "key": "Tags",
            "name": "Tags",
            "hintText": "Tags",
            "helpText": "Tags",
            "isExtendedSchema": false,
            "required": false,
            "type": "array",
            "controlType": "array",
            "as": "object",
            "properties": [
              {
                "key": "id",
                "name": "Id",
                "hintText": "Id",
                "helpText": "Id",
                "isExtendedSchema": false,
                "required": false,
                "type": "string",
                "controlType": "text"
              },
              {
                "key": "name",
                "name": "Name",
                "hintText": "Name",
                "helpText": "Name",
                "isExtendedSchema": false,
                "required": false,
                "type": "string",
                "controlType": "text"
              },
              {
                "key": "workspaceId",
                "name": "Workspace Id",
                "hintText": "Workspace Id",
                "helpText": "Workspace Id",
                "isExtendedSchema": false,
                "required": false,
                "type": "string",
                "controlType": "text"
              },
              {
                "key": "archived",
                "name": "Archived",
                "hintText": "Archived",
                "helpText": "Archived",
                "isExtendedSchema": false,
                "required": false,
                "type": "boolean",
                "controlType": "select",
                "pickList": [
                  [
                    "Yes",
                    true
                  ],
                  [
                    "No",
                    false
                  ]
                ]
              }
            ]
          }
        ],
        sample_output: connection => {}
      },
      add_new_client: {
        description: "Add New Client",
        hint: "Add <b>new client in your workspace</b> via <b>Clockify</b>",

        input_fields: () => [
          {
            key: "workspaceId",
            name: "Select Workspace",
            hintText: "The workspace in which you want to retrive a list of tags",
            helpText: "The workspace in which you want to retrive a list of tags",
            required: true,
            type: "pickList",
            controlType: "select",
            isExtendedSchema: false,
            dynamicPickList : "workspaces",
            toogleHint: "Select Workspace",
            toogleField : {
              key: "workspaceId_tf",
              name: "Enter Workspace ID",
              hintText: "The workspace in which you want to retrive a list of tags",
              helpText: "The workspace in which you want to retrive a list of tags",
              required: true,
              isExtendedSchema: false,
              type: "string",
              controlType: "text",
              toogleHint: "Enter Workspace ID",
            }
          },
          {
            key: "name",
            name: "Name",
            hintText: "The name of the client whom you want to add to a workspace. E.g, John Doe.",
            helpText: "The name of the client whom you want to add to a workspace. E.g, John Doe.",
            required: true,
            type: "string",
            controlType: "text",
            isExtendedSchema: false,
          },
          {
            key: "email",
            name: "Email",
            hintText: "The email of the client whom you want to add to a workspace. E.g, John Doe.",
            helpText: "The email of the client whom you want to add to a workspace. E.g, John Doe.",
            required: false,
            type: "string",
            controlType: "text",
            isExtendedSchema: false,
          },
          {
            key: "address",
            name: "Address",
            hintText: "The address of the client whom you want to add to a workspace. E.g, John Doe.",
            helpText: "The address of the client whom you want to add to a workspace. E.g, John Doe.",
            required: false,
            type: "string",
            controlType: "text",
            isExtendedSchema: false,
          }
        ],

        execute: async (connection, input) => {
          try {
            let postBody = {
              "name" : input.name,
            };

            const url = `https://api.clockify.me/api/v1/workspaces/${input.workspaceId}/clients`;

            // const headers = app.connection.authorization.credentials(connection);
            let headers = {
              "x-api-key" : connection.input.apiKey
            }
            const response = await HttpUtils.request(url, headers, null, HttpUtils.HTTPMethods.POST, postBody);

            if (response.success === true) {
              let responseBody = response.body;
              let tagsObject = {
                "Client": responseBody,
              };
              return HttpUtils.successResponse(tagsObject);
              // return HttpUtils.successResponse(response.body);
            } else {
              return HttpUtils.errorResponse(response.body, response.statusCode);
            }
          } catch (error) {
            console.log(error);
            return HttpUtils.errorResponse(error.message);
          }
        },

        output_fields: () => [
          {
            "key": "Client",
            "name": "Client",
            "hintText": "Tags",
            "helpText": "Tags",
            "isExtendedSchema": false,
            "required": false,
            "type": "array",
            "controlType": "array",
            "as": "object",
            "properties": [
              {
                "key": "id",
                "name": "Id",
                "hintText": "Id",
                "helpText": "Id",
                "isExtendedSchema": false,
                "required": false,
                "type": "string",
                "controlType": "text"
              },
              {
                "key": "name",
                "name": "Name",
                "hintText": "Name",
                "helpText": "Name",
                "isExtendedSchema": false,
                "required": false,
                "type": "string",
                "controlType": "text"
              },
              {
                "key": "workspaceId",
                "name": "Workspace Id",
                "hintText": "Workspace Id",
                "helpText": "Workspace Id",
                "isExtendedSchema": false,
                "required": false,
                "type": "string",
                "controlType": "text"
              },
              {
                "key": "archived",
                "name": "Archived",
                "hintText": "Archived",
                "helpText": "Archived",
                "isExtendedSchema": false,
                "required": false,
                "type": "boolean",
                "controlType": "select",
                "pickList": [
                  [
                    "Yes",
                    true
                  ],
                  [
                    "No",
                    false
                  ]
                ]
              }
            ]
          }
        ],
        sample_output: connection => {},
      }
    },
    triggers: {},
    test : async connection => {
      try{
        let headers = {
          "x-api-key" : connection.input.apiKey
        }
        let url = "https://api.clockify.me/api/v1/user";

        let response= await HttpUtils.request(url, headers);
        if (response.success == true) {
          return HttpUtils.successResponse(response.body);
        } else {
          return HttpUtils.errorResponse(response.message, response.statusCode);
        }
      }catch(error){
        return HttpUtils.errorResponse(error.message)
      }
    },
    
    pickLists : {
      workspaces: async connection => {
        try {
          let url = "https://api.clockify.me/api/v1/workspaces";
          let headers = {
            "x-api-key" : connection.input.apiKey
          }
          let response = await HttpUtils.request(url, headers);
          if (response.success == true) {
            // console.log(response.body);
            let list = response.body.map((item) => {
              return [item.name, item.id]

            })
            // console.log(list)
            return HttpUtils.successResponse(list);
          } else {
            return HttpUtils.errorResponse(response.body, response.statusCode);
          }
        } catch (error) {
          return HttpUtils.errorResponse(error.message);
        }
      },
    }
};

module.exports = app; 