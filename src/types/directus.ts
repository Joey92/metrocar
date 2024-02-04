import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from "openapi-client-axios";

export type DirectusResponse<T> = {
  data: T;
  meta?: {
    filter_count?: number;
    total_count?: number;
  };
};

export interface Error {
  errors: ErrorElement[];
}

export interface ErrorElement {
  message: string;
  extensions:
    | FieldValidationErrorExtensions
    | InvalidCredentialsErrorExtensions
    | InvalidOTPErrorExtensions;
}

export interface BaseExtension {
  stack: string;
}

export interface FieldValidationErrorExtensions {
  code: "FAILED_VALIDATION" | "RECORD_NOT_UNIQUE";
  field: string;
  type: string;
  invalid: string;
}

export interface InvalidCredentialsErrorExtensions {
  code: "INVALID_CREDENTIALS";
}

export interface InvalidOTPErrorExtensions {
  code: "INVALID_OTP";
}

export namespace Components {
  export namespace Parameters {
    export type Collection = string;
    export type Fields = string[];
    export type Filter =
      string /* ^(\[[^\[\]]*?\]){1}(\[(_eq|_neq|_lt|_lte|_gt|_gte|_in|_nin|_null|_nnull|_contains|_ncontains|_between|_nbetween|_empty|_nempty)\])?=.*?$ */[];
    export type Id = number;
    export type Limit = number;
    export type Meta = string;
    export type Mode = "jwt" | "cookie";
    export type Offset = number;
    export type Page = number;
    export type Search = string;
    export type Sort = string[];
    /**
     * example:
     * 8cbb43fe-4cdf-4991-8352-c461779cec02
     */
    export type UUId = string;
  }
  export interface PathParameters {
    Id?: Parameters.Id;
    UUId?: /**
     * example:
     * 8cbb43fe-4cdf-4991-8352-c461779cec02
     */
    Parameters.UUId;
    Collection?: Parameters.Collection;
  }
  export interface QueryParameters {
    Search?: Parameters.Search;
    Page?: Parameters.Page;
    Offset?: Parameters.Offset;
    Sort?: Parameters.Sort;
    Meta?: Parameters.Meta;
    Limit?: Parameters.Limit;
    Filter?: Parameters.Filter;
    Fields?: Parameters.Fields;
    Mode?: Parameters.Mode;
  }
  export namespace Responses {
    export interface NotFoundError {
      error?: {
        code?: number; // int64
        message?: string;
      };
    }
    export interface UnauthorizedError {
      error?: {
        code?: number; // int64
        message?: string;
      };
    }
  }
  export namespace Schemas {
    export interface Activity {
      /**
       * Unique identifier for the object.
       * example:
       * 2
       */
      id?: number;
      /**
       * Action that was performed.
       * example:
       * update
       */
      action?: "create" | "update" | "delete" | "login";
      /**
       * The user who performed this action.
       */
      user?: /* The user who performed this action. */ null | Users;
      /**
       * When the action happened.
       * example:
       * 2019-12-05T22:52:09Z
       */
      timestamp?: string; // date-time
      /**
       * The IP address of the user at the time the action took place.
       * example:
       * 127.0.0.1
       */
      ip?: /**
       * The IP address of the user at the time the action took place.
       * example:
       * 127.0.0.1
       */
      string /* ipv4 */;
      /**
       * User agent string of the browser the user used when the action took place.
       * example:
       * Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML,like Gecko) Chrome/78.0.3904.108 Safari/537.36
       */
      user_agent?: string;
      /**
       * Collection identifier in which the item resides.
       */
      collection?: /* Collection identifier in which the item resides. */
      string | Collections;
      /**
       * Unique identifier for the item the action applied to. This is always a string, even for integer primary keys.
       * example:
       * 328
       */
      item?: string;
      /**
       * User comment. This will store the comments that show up in the right sidebar of the item edit page in the admin app.
       * example:
       */
      comment?: string | null;
      revisions?: (number | Revisions)[];
    }
    export interface Collections {
      /**
       * The collection key.
       * example:
       * customers
       */
      collection?: string;
      icon?: string | null;
      note?: string | null;
      display_template?: string | null;
      hidden?: boolean;
      singleton?: boolean;
      translations?: string[] | null;
      archive_field?: string | null;
      archive_app_filter?: boolean;
      archive_value?: string | null;
      unarchive_value?: string | null;
      sort_field?: string | null;
      accountability?: string | null;
      color?: string | null;
      item_duplication_fields?: string[] | null;
      sort?: null | number;
      group?: null | Collections;
      collapse?: string;
      collection_divider?: string;
      archive_divider?: string;
      sort_divider?: string;
      accountability_divider?: string;
      duplication_divider?: string;
    }
    export interface Fields {
      id?: number;
      /**
       * Unique name of the collection this field is in.
       * example:
       * about_us
       */
      collection?: string;
      /**
       * Unique name of the field. Field name is unique within the collection.
       * example:
       * id
       */
      field?: string;
      special?: string[] | null;
      interface?: string | null;
      options?: string[] | null;
      display?: string | null;
      display_options?: string[] | null;
      readonly?: boolean;
      hidden?: boolean;
      sort?: null | number;
      width?: string | null;
      translations?: string[] | null;
      note?: string | null;
      conditions?: string[] | null;
      required?: boolean | null;
      group?: null | Fields;
      validation?: string[] | null;
      validation_message?: string | null;
    }
    export interface Files {
      /**
       * Unique identifier for the file.
       * example:
       * 8cbb43fe-4cdf-4991-8352-c461779cec02
       */
      id?: string;
      /**
       * Where the file is stored. Either `local` for the local filesystem or the name of the storage adapter (for example `s3`).
       * example:
       * local
       */
      storage?: string;
      /**
       * Name of the file on disk. By default, Directus uses a random hash for the filename.
       * example:
       * a88c3b72-ac58-5436-a4ec-b2858531333a.jpg
       */
      filename_disk?: string;
      /**
       * How you want to the file to be named when it's being downloaded.
       * example:
       * avatar.jpg
       */
      filename_download?: string;
      /**
       * Title for the file. Is extracted from the filename on upload, but can be edited by the user.
       * example:
       * User Avatar
       */
      title?: string;
      /**
       * MIME type of the file.
       * example:
       * image/jpeg
       */
      type?: string;
      /**
       * Virtual folder where this file resides in.
       * example:
       */
      folder?: /**
       * Virtual folder where this file resides in.
       * example:
       */
      null | Folders;
      /**
       * Who uploaded the file.
       * example:
       * 63716273-0f29-4648-8a2a-2af2948f6f78
       */
      uploaded_by?: /**
       * Who uploaded the file.
       * example:
       * 63716273-0f29-4648-8a2a-2af2948f6f78
       */
      string | Users;
      /**
       * When the file was uploaded.
       * example:
       * 2019-12-03T00:10:15+00:00
       */
      uploaded_on?: string; // date-time
      modified_by?: null /* uuid */ | Users;
      modified_on?: string; // timestamp
      /**
       * Character set of the file.
       * example:
       * binary
       */
      charset?: string | null;
      /**
       * Size of the file in bytes.
       * example:
       * 137862
       */
      filesize?: number;
      /**
       * Width of the file in pixels. Only applies to images.
       * example:
       * 800
       */
      width?: null | number;
      /**
       * Height of the file in pixels. Only applies to images.
       * example:
       * 838
       */
      height?: null | number;
      /**
       * Duration of the file in seconds. Only applies to audio and video.
       * example:
       * 0
       */
      duration?: null | number;
      /**
       * Where the file was embedded from.
       * example:
       */
      embed?: string | null;
      /**
       * Description for the file.
       */
      description?: string | null;
      /**
       * Where the file was created. Is automatically populated based on EXIF data for images.
       */
      location?: string | null;
      /**
       * Tags for the file. Is automatically populated based on EXIF data for images.
       */
      tags?: string[] | null;
      /**
       * IPTC, EXIF, and ICC metadata extracted from file
       */
      metadata?: {
        [key: string]: any;
      } | null;
      storage_divider?: string;
    }
    export interface Folders {
      /**
       * Unique identifier for the folder.
       * example:
       * 0cf0e03d-4364-45df-b77b-ca61f61869d2
       */
      id?: string;
      /**
       * Name of the folder.
       * example:
       * New York
       */
      name?: string;
      /**
       * Unique identifier of the parent folder. This allows for nested folders.
       * example:
       */
      parent?: /**
       * Unique identifier of the parent folder. This allows for nested folders.
       * example:
       */
      null | Folders;
    }
    export interface ItemsAgencies {
      id?: string; // uuid
      agency_name?: string;
      agency_url?: string;
      agency_timezone?: string;
      agency_lang?: string | null;
      agency_phone?: string | null;
      agency_fare_url?: string | null;
      agency_email?: string | null;
      created_at?: string; // timestamp
      updated_at?: string | null; // timestamp
      alerts?: ItemsRtAlerts[] | null;
    }
    export interface ItemsCalendar {
      id?: string; // uuid
      monday?: boolean;
      tuesday?: boolean;
      wednesday?: boolean;
      thursday?: boolean;
      friday?: boolean;
      saturday?: boolean;
      sunday?: boolean;
      start_date?: string; // date
      end_date?: string; // date
    }
    export interface ItemsRealTime {}
    export interface ItemsRoutes {
      id?: string;
      route_hash?: string;
      route_short_name?: string;
      route_long_name?: string | null;
      route_desc?: string | null;
      route_url?: string | null;
      created_at?: string; // timestamp
      updated_at?: string | null; // timestamp
      agency?: null /* uuid */ | ItemsAgencies;
      route_type?: null | number;
      route_text_color?: string | null;
      route_color?: string | null;
      continuous_pickup?: number;
      continuous_drop_off?: number;
      alerts?: ItemsRtAlerts[] | null;
    }
    export interface ItemsRtAlertTimes {
      alert?: ItemsRtAlerts;
      id?: string; // uuid
      start_time?: string | null; // date
      end_time?: string | null; // date
    }
    export interface ItemsRtAlerts {
      id?: string; // uuid
      created_at?: string; // timestamp
      updated_at?: string | null; // timestamp
      translation?: string;
      cause?: string | null;
      effect?: string | null;
      severity?: string | null;
      /**
       * Optionally include a trip to the alert
       */
      trip?: /* Optionally include a trip to the alert */ null /* uuid */ | ItemsTrips;
      /**
       * Optionally include a stop to the alert
       */
      stop?: /* Optionally include a stop to the alert */ null /* uuid */ | ItemsStops;
      /**
       * Optionally include an agency to the alert
       */
      agency?: /* Optionally include an agency to the alert */ null /* uuid */ | ItemsAgencies;
      /**
       * Optionally include a route to the alert
       */
      route?: /* Optionally include a route to the alert */ null | ItemsRoutes;
      times?: ItemsRtAlertTimes[] | null;
    }
    export interface ItemsRtStopTimeUpdates {
      trip_update?: string; // uuid
      arrival_delay?: null | number;
      departure_delay?: null | number;
      stop_sequence?: number;
      trip?: ItemsTrips;
      start_date?: string | null; // date
      created_at?: string; // timestamp
      updated_at?: string; // timestamp
      schedule_relationship?: string | null;
    }
    export interface ItemsRtTripUpdates {
      trip?: ItemsTrips;
      start_date?: string | null; // date
      vehicle?: null /* uuid */ | ItemsVehicles;
      created_at?: string; // timestamp
      updated_at?: string; // timestamp
      id?: string; // uuid
      delay?: null | number;
      lat?: number | null; // float
      lon?: number | null; // float
      schedule_relationship?: string | null;
      seats?: null | number;
    }
    export interface ItemsShapes {
      id?: string; // uuid
      shape?: {
        [key: string]: any;
      } | null;
      shape_dist?: string[] | null;
      route_hash?: string | null;
    }
    export interface ItemsStopTimes {
      trip?: ItemsTrips;
      stop?: ItemsStops;
      stop_sequence?: number;
      stop_headsign?: string | null;
      shape_dist_traveled?: null | number;
      id?: string; // uuid
      pickup_type?: null | number;
      drop_off_type?: null | number;
      continuous_pickup?: null | number;
      continuous_drop_off?: null | number;
      timepoint?: null | number;
      arrival?: string | null;
      departure?: string | null;
    }
    export interface ItemsStops {
      id?: string; // uuid
      stop_code?: string | null;
      stop_name?: string;
      tts_stop_name?: string | null;
      stop_desc?: string | null;
      zone_id?: string | null;
      stop_url?: string | null;
      parent_stop_id?: string | null;
      stop_timezone?: string | null;
      level_id?: string | null;
      platform_code?: string | null;
      active?: boolean | null;
      created_at?: string; // timestamp
      updated_at?: string | null; // timestamp
      reporter?: null /* uuid */ | string | Users;
      location?: {
        [key: string]: any;
      } | null;
      location_type?: null | number;
      wheelchair_boarding?: null | number;
      alerts?: ItemsRtAlerts[] | null;
      stop_times?: ItemsStopTimes[] | null;
      "links-8wcb8m"?: string;
      "divider-njwlht"?: string;
      map_image?: string | null;
      private?: boolean;
    }
    export interface ItemsTickets {
      id?: string; // uuid
      date_created?: string | null; // timestamp
      date_updated?: string | null; // timestamp
      trip?: string /* uuid */ | null | ItemsTrips;
      start_date?: string | null; // date
      origin_stop_sequence?: null | number;
      destination_stop_sequence?: null | number;
      approved?: boolean | null;
      owner?: null /* uuid */ | Users;
      deny_reason?: string | null;
    }
    export interface ItemsTrips {
      id?: string; // uuid
      route?: null | ItemsRoutes;
      calendar?: null /* uuid */ | ItemsCalendar;
      trip_headsign?: string | null;
      trip_short_name?: string | null;
      /**
       * Always outbound for now
       */
      direction_id?: boolean | null;
      block_id?: string | null;
      start_date?: string | null; // date
      owner?: string /* uuid */ | Users;
      created_at?: string; // timestamp
      updated_at?: string | null; // timestamp
      shape?: null /* uuid */ | ItemsShapes;
      wheelchair_accessible?: null | number;
      bikes_allowed?: null | number;
      feature_tickets?: boolean | null;
      feature_fares?: boolean | null;
      feature_driver_app?: boolean | null;
      alerts?: ItemsRtAlerts[] | null;
      tickets?: ItemsTickets[] | null;
      "divider-q5v4lz"?: string;
      stop_times?: ItemsStopTimes[] | null;
      trip_updates?: ItemsRtTripUpdates[] | null;
    }
    export interface ItemsVehicles {
      id?: string; // uuid
      description?: string | null;
      licenseplate?: string | null;
      owner?: null /* uuid */ | Users;
      active?: boolean | null;
      created_at?: string; // timestamp
      updated_at?: string | null; // timestamp
      deactivated_at?: string | null; // timestamp
      minimum_seats?: null | number;
    }
    export interface Permissions {
      /**
       * Unique identifier for the permission.
       * example:
       * 1
       */
      id?: number;
      /**
       * Unique identifier of the role this permission applies to.
       * example:
       * 2f24211d-d928-469a-aea3-3c8f53d4e426
       */
      role?: string | null;
      /**
       * What collection this permission applies to.
       * example:
       * customers
       */
      collection?: string;
      /**
       * What action this permission applies to.
       * example:
       * create
       */
      action?: "create" | "read" | "update" | "delete";
      /**
       * JSON structure containing the permissions checks for this permission.
       */
      permissions?: {
        [key: string]: any;
      } | null;
      /**
       * JSON structure containing the validation checks for this permission.
       */
      validation?: {
        [key: string]: any;
      } | null;
      /**
       * JSON structure containing the preset value for created/updated items.
       */
      presets?: {
        [key: string]: any;
      } | null;
      /**
       * CSV of fields that the user is allowed to interact with.
       */
      fields?: string[] | null;
    }
    export interface Presets {
      /**
       * Unique identifier for this single collection preset.
       * example:
       * 155
       */
      id?: number;
      /**
       * Name for the bookmark. If this is set, the preset will be considered a bookmark.
       */
      bookmark?: string | null;
      /**
       * The unique identifier of the user to whom this collection preset applies.
       * example:
       * 63716273-0f29-4648-8a2a-2af2948f6f78
       */
      user?: /**
       * The unique identifier of the user to whom this collection preset applies.
       * example:
       * 63716273-0f29-4648-8a2a-2af2948f6f78
       */
      null | Users;
      /**
       * The unique identifier of a role in the platform. If `user` is null, this will be used to apply the collection preset or bookmark for all users in the role.
       * example:
       * 50419801-0f30-8644-2b3c-9bc2d980d0a0
       */
      role?: /**
       * The unique identifier of a role in the platform. If `user` is null, this will be used to apply the collection preset or bookmark for all users in the role.
       * example:
       * 50419801-0f30-8644-2b3c-9bc2d980d0a0
       */
      null | Roles;
      /**
       * What collection this collection preset is used for.
       * example:
       * articles
       */
      collection?: /**
       * What collection this collection preset is used for.
       * example:
       * articles
       */
      string | Collections;
      /**
       * Search query.
       */
      search?: string | null;
      /**
       * Key of the layout that is used.
       * example:
       */
      layout?: string;
      /**
       * Layout query that's saved per layout type. Controls what data is fetched on load. These follow the same format as the JS SDK parameters.
       * example:
       * {
       *   "cards": {
       *     "sort": "-published_on"
       *   }
       * }
       */
      layout_query?: null;
      /**
       * Options of the views. The properties in here are controlled by the layout.
       * example:
       * {
       *   "cards": {
       *     "icon": "account_circle",
       *     "title": "{{ first_name }} {{ last_name }}",
       *     "subtitle": "{{ title }}",
       *     "size": 3
       *   }
       * }
       */
      layout_options?: null;
      refresh_interval?: null | number;
      filter?: string[] | null;
      icon?: string;
      color?: string | null;
    }
    export interface Relations {
      /**
       * Unique identifier for the relation.
       * example:
       * 1
       */
      id?: number;
      /**
       * Collection that has the field that holds the foreign key.
       * example:
       * directus_activity
       */
      many_collection?: string;
      /**
       * Foreign key. Field that holds the primary key of the related collection.
       * example:
       * user
       */
      many_field?: string;
      /**
       * Collection on the _one_ side of the relationship.
       * example:
       * directus_users
       */
      one_collection?: string;
      /**
       * Alias column that serves as the _one_ side of the relationship.
       * example:
       */
      one_field?: string | null;
      one_collection_field?: string | null;
      one_allowed_collections?: string[] | null;
      /**
       * Field on the junction table that holds the many field of the related relation.
       * example:
       */
      junction_field?: string | null;
      sort_field?: string | null;
      one_deselect_action?: string;
    }
    export interface Revisions {
      /**
       * Unique identifier for the revision.
       * example:
       * 1
       */
      id?: number;
      /**
       * Unique identifier for the activity record.
       * example:
       * 2
       */
      activity?: /**
       * Unique identifier for the activity record.
       * example:
       * 2
       */
      number | Activity;
      /**
       * Collection of the updated item.
       * example:
       * articles
       */
      collection?: /**
       * Collection of the updated item.
       * example:
       * articles
       */
      string | Collections;
      /**
       * Primary key of updated item.
       * example:
       * 168
       */
      item?: string;
      /**
       * Copy of item state at time of update.
       * example:
       * {
       *   "author": 1,
       *   "body": "This is my first post",
       *   "featured_image": 15,
       *   "id": "168",
       *   "title": "Hello, World!"
       * }
       */
      data?: {
        [key: string]: any;
      } | null;
      /**
       * Changes between the previous and the current revision.
       * example:
       * {
       *   "title": "Hello, World!"
       * }
       */
      delta?: {
        [key: string]: any;
      };
      /**
       * If the current item was updated relationally, this is the id of the parent revision record
       * example:
       */
      parent?: null | number;
    }
    export interface Roles {
      /**
       * Unique identifier for the role.
       * example:
       * 2f24211d-d928-469a-aea3-3c8f53d4e426
       */
      id?: string;
      /**
       * Name of the role.
       * example:
       * Administrator
       */
      name?: string;
      /**
       * The role's icon.
       * example:
       * verified_user
       */
      icon?: string;
      /**
       * Description of the role.
       * example:
       * Admins have access to all managed data within the system by default
       */
      description?: string | null;
      /**
       * Array of IP addresses that are allowed to connect to the API as a user of this role.
       * example:
       * []
       */
      ip_access?: string[];
      /**
       * Whether or not this role enforces the use of 2FA.
       * example:
       * false
       */
      enforce_tfa?: boolean;
      /**
       * Admin role. If true, skips all permission checks.
       * example:
       * false
       */
      admin_access?: boolean;
      /**
       * The users in the role are allowed to use the app.
       * example:
       * true
       */
      app_access?: boolean;
      users?: (string /* uuid */ | Users)[];
    }
    export interface Settings {
      /**
       * Unique identifier for the setting.
       * example:
       * 1
       */
      id?: number;
      /**
       * The name of the project.
       * example:
       * Directus
       */
      project_name?: string;
      /**
       * The url of the project.
       * example:
       */
      project_url?: string | null;
      /**
       * The brand color of the project.
       * example:
       */
      project_color?: string | null;
      /**
       * The logo of the project.
       * example:
       */
      project_logo?: string | null;
      /**
       * The foreground of the project.
       * example:
       */
      public_foreground?: string | null;
      /**
       * The background of the project.
       * example:
       */
      public_background?: string | null;
      /**
       * Note rendered on the public pages of the app.
       * example:
       */
      public_note?: string | null;
      /**
       * Allowed authentication login attempts before the user's status is set to blocked.
       * example:
       * 25
       */
      auth_login_attempts?: number;
      /**
       * Authentication password policy.
       */
      auth_password_policy?: string | null;
      /**
       * What transformations are allowed in the assets endpoint.
       * example:
       * all
       */
      storage_asset_transform?: "all" | "none" | "presets";
      /**
       * Array of allowed
       * example:
       */
      storage_asset_presets?:
        | {
            /**
             * Key for the asset. Used in the assets endpoint.
             */
            key?: string;
            /**
             * Whether to crop the thumbnail to match the size, or maintain the aspect ratio.
             */
            fit?: "cover" | "contain" | "inside" | "outside";
            /**
             * Width of the thumbnail.
             */
            width?: number;
            /**
             * Height of the thumbnail.
             */
            height?: number;
            /**
             * No image upscale
             */
            withoutEnlargement?: boolean;
            /**
             * Quality of the compression used.
             */
            quality?: number;
            /**
             * Reformat output image
             */
            format?: "" | "jpeg" | "png" | "webp" | "tiff";
            /**
             * Additional transformations to apply
             */
            transforms?:
              | {
                  /**
                   * The Sharp method name
                   */
                  method?: string;
                  /**
                   * A list of arguments to pass to the Sharp method
                   */
                  arguments?:
                    | {
                        /**
                         * A JSON representation of the argument value
                         */
                        argument?: string;
                      }[]
                    | null;
                }[]
              | null;
          }[]
        | null;
      custom_css?: string | null;
      /**
       * Default folder to place files
       */
      storage_default_folder?: string; // uuid
      basemaps?: string[] | null;
      mapbox_key?: string | null;
      module_bar?: string[] | null;
      project_descriptor?: string | null;
      translation_strings?: string[] | null;
      default_language?: string;
      branding_divider?: string;
      modules_divider?: string;
      security_divider?: string;
      files_divider?: string;
      map_divider?: string;
    }
    export interface Users {
      /**
       * Unique identifier for the user.
       * example:
       * 63716273-0f29-4648-8a2a-2af2948f6f78
       */
      id?: string;
      /**
       * First name of the user.
       * example:
       * Admin
       */
      first_name?: string;
      /**
       * Last name of the user.
       * example:
       * User
       */
      last_name?: string;
      /**
       * Unique email address for the user.
       * example:
       * admin@example.com
       */
      email?: string; // email
      /**
       * Password of the user.
       */
      password?: string;
      /**
       * The user's location.
       * example:
       */
      location?: string | null;
      /**
       * The user's title.
       * example:
       */
      title?: string | null;
      /**
       * The user's description.
       * example:
       */
      description?: string | null;
      /**
       * The user's tags.
       * example:
       */
      tags?: string[] | null;
      /**
       * The user's avatar.
       * example:
       */
      avatar?: /**
       * The user's avatar.
       * example:
       */
      null | Files;
      /**
       * The user's language used in Directus.
       * example:
       * en-US
       */
      language?: string;
      /**
       * What theme the user is using.
       * example:
       * auto
       */
      theme?: "light" | "dark" | "auto";
      /**
       * The 2FA secret string that's used to generate one time passwords.
       * example:
       */
      tfa_secret?: string | null;
      /**
       * Status of the user.
       * example:
       * active
       */
      status?: "active" | "invited" | "draft" | "suspended" | "deleted";
      /**
       * Unique identifier of the role of this user.
       * example:
       * 2f24211d-d928-469a-aea3-3c8f53d4e426
       */
      role?: /**
       * Unique identifier of the role of this user.
       * example:
       * 2f24211d-d928-469a-aea3-3c8f53d4e426
       */
      string | Roles;
      /**
       * Static token for the user.
       */
      token?: string | null;
      last_access?: string | null; // timestamp
      /**
       * Last page that the user was on.
       * example:
       * /my-project/settings/collections/a
       */
      last_page?: string | null;
      provider?: string;
      external_identifier?: string | null;
      auth_data?: string[] | null;
      email_notifications?: boolean | null;
      preferences_divider?: string;
      admin_divider?: string;
      display_name?: string;
    }
    export interface Webhooks {
      /**
       * The index of the webhook.
       * example:
       * 1
       */
      id?: number;
      /**
       * The name of the webhook.
       * example:
       * create articles
       */
      name?: string;
      /**
       * Method used in the webhook.
       * example:
       * POST
       */
      method?: string;
      /**
       * The url of the webhook.
       * example:
       */
      url?: string | null;
      /**
       * The status of the webhook.
       * example:
       * inactive
       */
      status?: string;
      /**
       * If yes, send the content of what was done
       * example:
       * true
       */
      data?: boolean;
      /**
       * The actions that triggers this webhook.
       * example:
       */
      actions?: string[] | null;
      collections?: string[];
      headers?: string[] | null;
      triggers_divider?: string;
    }
  }
}
export namespace Paths {
  export namespace AcceptInvite {
    export interface RequestBody {
      /**
       * Accept invite token.
       * example:
       * eyJh...KmUk
       */
      token?: string;
      /**
       * Password of the user.
       * example:
       * d1r3ctu5
       */
      password?: string; // password
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Users;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace CreateCollection {
    export namespace Parameters {
      export type $0 = Components.Parameters.Meta;
    }
    export interface RequestBody {
      /**
       * Unique name of the collection.
       * example:
       * my_collection
       */
      collection: string;
      /**
       * The fields contained in this collection. See the fields reference for more information. Each individual field requires field, type, and interface to be provided.
       */
      fields: {
        [key: string]: any;
      }[];
      /**
       * Name of a Google Material Design Icon that's assigned to this collection.
       * example:
       * people
       */
      icon?: string | null;
      /**
       * A note describing the collection.
       * example:
       */
      note?: string | null;
      /**
       * Text representation of how items from this collection are shown across the system.
       * example:
       */
      display_template?: string | null;
      /**
       * Whether or not the collection is hidden from the navigation in the admin app.
       * example:
       * false
       */
      hidden?: boolean;
      /**
       * Whether or not the collection is treated as a single object.
       * example:
       * false
       */
      singleton?: boolean;
      /**
       * Key value pairs of how to show this collection's name in different languages in the admin app.
       * example:
       */
      translation?: string | null;
      /**
       * What field holds the archive value.
       * example:
       */
      archive_field?: string | null;
      /**
       * What value to use for "archived" items.
       * example:
       */
      archive_app_filter?: string | null;
      /**
       * What value to use to "unarchive" items.
       * example:
       */
      archive_value?: string | null;
      /**
       * Whether or not to show the "archived" filter.
       * example:
       */
      unarchive_value?: string | null;
      /**
       * The sort field in the collection.
       * example:
       */
      sort_field?: string | null;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Collections;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace CreateComment {
    export namespace Parameters {
      export type $0 = Components.Parameters.Meta;
    }
    export interface RequestBody {
      /**
       * example:
       * projects
       */
      collection: string;
      /**
       * example:
       * 1
       */
      item: number;
      /**
       * example:
       * A new comment
       */
      comment: string;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Activity;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace CreateField {
    export namespace Parameters {
      export type Collection = string;
    }
    export interface PathParameters {
      collection: Parameters.Collection;
    }
    export interface RequestBody {
      /**
       * Unique name of the field. Field name is unique within the collection.
       * example:
       * id
       */
      field: string;
      /**
       * Directus specific data type. Used to cast values in the API.
       * example:
       * integer
       */
      type: string;
      /**
       * The schema info.
       */
      schema?: {
        /**
         * The name of the field.
         * example:
         * title
         */
        name?: string;
        /**
         * The collection of the field.
         * example:
         * posts
         */
        table?: string;
        /**
         * The type of the field.
         * example:
         * string
         */
        type?: string;
        /**
         * The default value of the field.
         * example:
         */
        default_value?: string | null;
        /**
         * The max length of the field.
         * example:
         */
        max_length?: null | number;
        /**
         * If the field is nullable.
         * example:
         * false
         */
        is_nullable?: boolean;
        /**
         * If the field is primary key.
         * example:
         * false
         */
        is_primary_key?: boolean;
        /**
         * If the field has auto increment.
         * example:
         * false
         */
        has_auto_increment?: boolean;
        /**
         * Related column from the foreign key constraint.
         * example:
         */
        foreign_key_column?: string | null;
        /**
         * Related table from the foreign key constraint.
         * example:
         */
        foreign_key_table?: string | null;
        /**
         * Comment as saved in the database.
         * example:
         */
        comment?: string | null;
        /**
         * Database schema (pg only).
         * example:
         * public
         */
        schema?: string;
        /**
         * Related schema from the foreign key constraint (pg only).
         * example:
         */
        foreign_key_schema?: string | null;
      };
      /**
       * The meta info.
       */
      meta?: {
        /**
         * Unique identifier for the field in the `directus_fields` collection.
         * example:
         * 3
         */
        id?: number;
        /**
         * Unique name of the collection this field is in.
         * example:
         * posts
         */
        collection?: string;
        /**
         * Unique name of the field. Field name is unique within the collection.
         * example:
         * title
         */
        field?: string;
        /**
         * Transformation flag for field
         * example:
         */
        special?: string[] | null;
        /**
         * What interface is used in the admin app to edit the value for this field.
         * example:
         * primary-key
         */
        "system-interface"?: string | null;
        /**
         * Options for the interface that's used. This format is based on the individual interface.
         * example:
         */
        options?: {
          [key: string]: any;
        } | null;
        /**
         * What display is used in the admin app to display the value for this field.
         * example:
         */
        display?: string | null;
        /**
         * Options for the display that's used. This format is based on the individual display.
         * example:
         */
        display_options?: {
          [key: string]: any;
        } | null;
        /**
         * If the field can be altered by the end user. Directus system fields have this value set to `true`.
         * example:
         * true
         */
        locked?: boolean;
        /**
         * Prevents the user from editing the value in the field.
         * example:
         * false
         */
        readonly?: boolean;
        /**
         * If this field should be hidden.
         * example:
         * true
         */
        hidden?: boolean;
        /**
         * Sort order of this field on the edit page of the admin app.
         * example:
         * 1
         */
        sort?: null | number;
        /**
         * Width of the field on the edit form.
         * example:
         */
        width?: "half" | "half-left" | "half-right" | "full" | "fill" | null;
        /**
         * What field group this field is part of.
         * example:
         */
        group?: null | number;
        /**
         * Key value pair of `<language>: <translation>` that allows the user to change the displayed name of the field in the admin app.
         * example:
         */
        translation?: {
          [key: string]: any;
        } | null;
        /**
         * A user provided note for the field. Will be rendered alongside the interface on the edit page.
         * example:
         *
         */
        note?: string | null;
      } | null;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Fields;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace CreateFile {
    export interface RequestBody {
      data?: string;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Files;
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace CreateFolder {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Meta;
    }
    export interface RequestBody {
      /**
       * Name of the folder.
       * example:
       * Amsterdam
       */
      name: string;
      /**
       * Unique identifier of the parent folder. This allows for nested folders.
       */
      parent?: number;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Folders;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace CreateItemsAgencies {
    export namespace Parameters {
      export type $0 = Components.Parameters.Meta;
    }
    export type RequestBody =
      | {
          [key: string]: any;
        }
      | Components.Schemas.ItemsAgencies;
    export namespace Responses {
      export interface $200 {
        data?: any;
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace CreateItemsCalendar {
    export namespace Parameters {
      export type $0 = Components.Parameters.Meta;
    }
    export type RequestBody =
      | {
          [key: string]: any;
        }
      | Components.Schemas.ItemsCalendar;
    export namespace Responses {
      export interface $200 {
        data?: any;
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace CreateItemsRealTime {
    export namespace Parameters {
      export type $0 = Components.Parameters.Meta;
    }
    export type RequestBody =
      | {
          [key: string]: any;
        }
      | Components.Schemas.ItemsRealTime;
    export namespace Responses {
      export interface $200 {
        data?: any;
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace CreateItemsRoutes {
    export namespace Parameters {
      export type $0 = Components.Parameters.Meta;
    }
    export type RequestBody =
      | {
          [key: string]: any;
        }
      | Components.Schemas.ItemsRoutes;
    export namespace Responses {
      export interface $200 {
        data?: any;
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace CreateItemsRtAlertTimes {
    export namespace Parameters {
      export type $0 = Components.Parameters.Meta;
    }
    export type RequestBody =
      | {
          [key: string]: any;
        }
      | Components.Schemas.ItemsRtAlertTimes;
    export namespace Responses {
      export interface $200 {
        data?: any;
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace CreateItemsRtAlerts {
    export namespace Parameters {
      export type $0 = Components.Parameters.Meta;
    }
    export type RequestBody =
      | {
          [key: string]: any;
        }
      | Components.Schemas.ItemsRtAlerts;
    export namespace Responses {
      export interface $200 {
        data?: any;
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace CreateItemsRtStopTimeUpdates {
    export namespace Parameters {
      export type $0 = Components.Parameters.Meta;
    }
    export type RequestBody =
      | {
          [key: string]: any;
        }
      | Components.Schemas.ItemsRtStopTimeUpdates;
    export namespace Responses {
      export interface $200 {
        data?: any;
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace CreateItemsRtTripUpdates {
    export namespace Parameters {
      export type $0 = Components.Parameters.Meta;
    }
    export type RequestBody =
      | {
          [key: string]: any;
        }
      | Components.Schemas.ItemsRtTripUpdates;
    export namespace Responses {
      export interface $200 {
        data?: any;
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace CreateItemsShapes {
    export namespace Parameters {
      export type $0 = Components.Parameters.Meta;
    }
    export type RequestBody =
      | {
          [key: string]: any;
        }
      | Components.Schemas.ItemsShapes;
    export namespace Responses {
      export interface $200 {
        data?: any;
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace CreateItemsStopTimes {
    export namespace Parameters {
      export type $0 = Components.Parameters.Meta;
    }
    export type RequestBody =
      | {
          [key: string]: any;
        }
      | Components.Schemas.ItemsStopTimes;
    export namespace Responses {
      export interface $200 {
        data?: any;
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace CreateItemsStops {
    export namespace Parameters {
      export type $0 = Components.Parameters.Meta;
    }
    export type RequestBody =
      | {
          [key: string]: any;
        }
      | Components.Schemas.ItemsStops;
    export namespace Responses {
      export interface $200 {
        data?: any;
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace CreateItemsTickets {
    export namespace Parameters {
      export type $0 = Components.Parameters.Meta;
    }
    export type RequestBody =
      | {
          [key: string]: any;
        }
      | Components.Schemas.ItemsTickets;
    export namespace Responses {
      export interface $200 {
        data?: any;
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace CreateItemsTrips {
    export namespace Parameters {
      export type $0 = Components.Parameters.Meta;
    }
    export type RequestBody =
      | {
          [key: string]: any;
        }
      | Components.Schemas.ItemsTrips;
    export namespace Responses {
      export interface $200 {
        data?: any;
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace CreateItemsVehicles {
    export namespace Parameters {
      export type $0 = Components.Parameters.Meta;
    }
    export type RequestBody =
      | {
          [key: string]: any;
        }
      | Components.Schemas.ItemsVehicles;
    export namespace Responses {
      export interface $200 {
        data?: any;
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace CreatePermission {
    export namespace Parameters {
      export type $0 = Components.Parameters.Meta;
    }
    export interface RequestBody {
      /**
       * What collection this permission applies to.
       * example:
       * customers
       */
      collection?: string;
      /**
       * If the user can post comments.
       */
      comment?: "none" | "create" | "update" | "full";
      /**
       * If the user can create items.
       */
      create?: "none" | "full";
      /**
       * If the user can update items.
       */
      delete?: "none" | "mine" | "role" | "full";
      /**
       * If the user is required to leave a comment explaining what was changed.
       */
      explain?: "none" | "create" | "update" | "always";
      /**
       * If the user can read items.
       */
      read?: "none" | "mine" | "role" | "full";
      /**
       * Unique identifier of the role this permission applies to.
       * example:
       * 3
       */
      role?: number;
      /**
       * Explicitly denies read access for specific fields.
       * example:
       * [
       *   "featured_image"
       * ]
       */
      read_field_blacklist?: string[];
      /**
       * What status this permission applies to.
       */
      status?: string;
      /**
       * Explicitly denies specific statuses to be used.
       */
      status_blacklist?: string[];
      /**
       * If the user can update items.
       */
      update?: "none" | "mine" | "role" | "full";
      /**
       * Explicitly denies write access for specific fields.
       */
      write_field_blacklist?: string[];
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Permissions;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace CreatePreset {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Meta;
    }
    export interface RequestBody {
      /**
       * What collection this collection preset is used for.
       * example:
       * articles
       */
      collection: string;
      /**
       * Name for the bookmark. If this is set, the collection preset will be considered to be a bookmark.
       * example:
       * Highly rated articles
       */
      title?: string;
      /**
       * The unique identifier of a role in the platform. If user is null, this will be used to apply the collection preset or bookmark for all users in the role.
       * example:
       */
      role?: string;
      /**
       * What the user searched for in search/filter in the header bar.
       */
      search?: string;
      filters?: {
        /**
         * example:
         * aHKLAakdVghzD
         */
        key?: string;
        /**
         * example:
         * rating
         */
        field?: string;
        /**
         * example:
         * gte
         */
        operator?: string;
        /**
         * example:
         * 4.5
         */
        value?: number;
      }[];
      /**
       * Name of the view type that is used.
       */
      layout?: string;
      /**
       * Layout query that's saved per layout type. Controls what data is fetched on load. These follow the same format as the JS SDK parameters.
       */
      layout_query?: string;
      /**
       * Options of the views. The properties in here are controlled by the layout.
       */
      layout_options?: string;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Presets;
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace CreateRelation {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Meta;
    }
    export interface RequestBody {
      /**
       * Collection that has the field that holds the foreign key.
       * example:
       * articles
       */
      collection_many?: string;
      /**
       * Collection on the _one_ side of the relationship.
       * example:
       * authors
       */
      collection_one?: string;
      /**
       * Foreign key. Field that holds the primary key of the related collection.
       * example:
       * author
       */
      field_many?: string;
      /**
       * Alias column that serves as the _one_ side of the relationship.
       * example:
       * books
       */
      field_one?: string;
      /**
       * Field on the junction table that holds the primary key of the related collection.
       */
      junction_field?: string;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Relations;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace CreateRole {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Meta;
    }
    export interface RequestBody {
      /**
       * Description of the role.
       */
      description?: string;
      /**
       * Whether or not this role enforces the use of 2FA.
       */
      enforce_2fa?: boolean;
      /**
       * ID used with external services in SCIM.
       */
      external_id?: string;
      /**
       * Array of IP addresses that are allowed to connect to the API as a user of this role.
       */
      ip_whitelist?: string[];
      /**
       * Custom override for the admin app module bar navigation.
       */
      module_listing?: string;
      /**
       * Name of the role.
       * example:
       * Interns
       */
      name?: string;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Roles;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace CreateUser {
    export namespace Parameters {
      export type $0 = Components.Parameters.Meta;
    }
    export type RequestBody = Components.Schemas.Users;
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Users;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace CreateWebhook {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Meta;
    }
    export interface RequestBody {
      /**
       * The name of the webhook.
       * example:
       * create articles
       */
      name?: string;
      /**
       * Method used in the webhook.
       * example:
       * POST
       */
      method?: string;
      /**
       * The url of the webhook.
       * example:
       */
      url?: string;
      /**
       * The status of the webhook.
       * example:
       * active
       */
      status?: string;
      /**
       * If yes, send the content of what was done
       * example:
       * true
       */
      data?: boolean;
      /**
       * The actions that triggers this webhook.
       * example:
       */
      actions?: any;
      /**
       * The collections that triggers this webhook.
       * example:
       */
      "system-collections"?: any;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Roles;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace DeleteCollection {
    export namespace Parameters {
      export type Id = string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export namespace Responses {
      export interface $200 {}
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace DeleteComment {
    export namespace Parameters {
      export type $0 = Components.Parameters.Id;
    }
    export namespace Responses {
      export interface $203 {}
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace DeleteField {
    export namespace Parameters {
      export type Collection = string;
      export type Id = string;
    }
    export interface PathParameters {
      collection: Parameters.Collection;
      id: Parameters.Id;
    }
    export namespace Responses {
      export interface $200 {}
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace DeleteFile {
    export namespace Parameters {
      export type $0 =
        /**
         * example:
         * 8cbb43fe-4cdf-4991-8352-c461779cec02
         */
        Components.Parameters.UUId;
    }
    export namespace Responses {
      export interface $200 {}
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace DeleteFolder {
    export namespace Parameters {
      export type $0 =
        /**
         * example:
         * 8cbb43fe-4cdf-4991-8352-c461779cec02
         */
        Components.Parameters.UUId;
    }
    export namespace Responses {
      export interface $200 {}
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace DeletePermission {
    export namespace Parameters {
      export type $0 = Components.Parameters.Id;
    }
    export namespace Responses {
      export interface $200 {}
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace DeletePreset {
    export namespace Parameters {
      export type $0 = Components.Parameters.Id;
    }
    export namespace Responses {
      export interface $200 {}
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace DeleteRelation {
    export namespace Parameters {
      export type $0 = Components.Parameters.Id;
    }
    export namespace Responses {
      export interface $200 {}
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace DeleteRole {
    export namespace Parameters {
      export type $0 =
        /**
         * example:
         * 8cbb43fe-4cdf-4991-8352-c461779cec02
         */
        Components.Parameters.UUId;
    }
    export namespace Responses {
      export interface $200 {}
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace DeleteSingleItemsAgencies {
    export namespace Parameters {
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export namespace Responses {
      export interface $200 {}
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace DeleteSingleItemsCalendar {
    export namespace Parameters {
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export namespace Responses {
      export interface $200 {}
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace DeleteSingleItemsRealTime {
    export namespace Parameters {
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export namespace Responses {
      export interface $200 {}
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace DeleteSingleItemsRoutes {
    export namespace Parameters {
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export namespace Responses {
      export interface $200 {}
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace DeleteSingleItemsRtAlertTimes {
    export namespace Parameters {
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export namespace Responses {
      export interface $200 {}
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace DeleteSingleItemsRtAlerts {
    export namespace Parameters {
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export namespace Responses {
      export interface $200 {}
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace DeleteSingleItemsRtStopTimeUpdates {
    export namespace Parameters {
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export namespace Responses {
      export interface $200 {}
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace DeleteSingleItemsRtTripUpdates {
    export namespace Parameters {
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export namespace Responses {
      export interface $200 {}
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace DeleteSingleItemsShapes {
    export namespace Parameters {
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export namespace Responses {
      export interface $200 {}
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace DeleteSingleItemsStopTimes {
    export namespace Parameters {
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export namespace Responses {
      export interface $200 {}
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace DeleteSingleItemsStops {
    export namespace Parameters {
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export namespace Responses {
      export interface $200 {}
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace DeleteSingleItemsTickets {
    export namespace Parameters {
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export namespace Responses {
      export interface $200 {}
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace DeleteSingleItemsTrips {
    export namespace Parameters {
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export namespace Responses {
      export interface $200 {}
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace DeleteSingleItemsVehicles {
    export namespace Parameters {
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export namespace Responses {
      export interface $200 {}
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace DeleteUser {
    export namespace Parameters {
      export type $0 =
        /**
         * example:
         * 8cbb43fe-4cdf-4991-8352-c461779cec02
         */
        Components.Parameters.UUId;
    }
    export namespace Responses {
      export interface $200 {}
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace DeleteWebhook {
    export namespace Parameters {
      export type $0 =
        /**
         * example:
         * 8cbb43fe-4cdf-4991-8352-c461779cec02
         */
        Components.Parameters.UUId;
    }
    export namespace Responses {
      export interface $200 {}
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace GetActivities {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Limit;
      export type $2 = Components.Parameters.Meta;
      export type $3 = Components.Parameters.Offset;
      export type $4 = Components.Parameters.Sort;
      export type $5 = Components.Parameters.Filter;
      export type $6 = Components.Parameters.Search;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Activity[];
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace GetActivity {
    export namespace Parameters {
      export type $0 = Components.Parameters.Id;
      export type $1 = Components.Parameters.Fields;
      export type $2 = Components.Parameters.Meta;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Activity;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace GetAsset {
    export namespace Parameters {
      export type Download = boolean;
      export type Id = string;
      export type Key = string;
      export type Transforms = string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export interface QueryParameters {
      key?: Parameters.Key;
      transforms?: Parameters.Transforms;
      download?: Parameters.Download;
    }
    export namespace Responses {
      export type $200 = string;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace GetCollection {
    export namespace Parameters {
      export type $1 = Components.Parameters.Meta;
      export type Id = string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Collections;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace GetCollectionField {
    export namespace Parameters {
      export type Collection = string;
      export type Id = string;
    }
    export interface PathParameters {
      collection: Parameters.Collection;
      id: Parameters.Id;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Fields;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace GetCollectionFields {
    export namespace Parameters {
      export type $1 = Components.Parameters.Sort;
      export type Collection = string;
    }
    export interface PathParameters {
      collection: Parameters.Collection;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Fields[];
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace GetCollections {
    export namespace Parameters {
      export type $0 = Components.Parameters.Offset;
      export type $1 = Components.Parameters.Meta;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Collections[];
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace GetDisplays {
    export namespace Responses {
      export interface $200 {
        data?: {
          [key: string]: any;
        }[];
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace GetFields {
    export namespace Parameters {
      export type $0 = Components.Parameters.Limit;
      export type $1 = Components.Parameters.Sort;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Fields[];
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace GetFile {
    export namespace Parameters {
      export type $0 =
        /**
         * example:
         * 8cbb43fe-4cdf-4991-8352-c461779cec02
         */
        Components.Parameters.UUId;
      export type $1 = Components.Parameters.Fields;
      export type $2 = Components.Parameters.Meta;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Files;
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace GetFiles {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Limit;
      export type $2 = Components.Parameters.Offset;
      export type $3 = Components.Parameters.Sort;
      export type $4 = Components.Parameters.Filter;
      export type $5 = Components.Parameters.Search;
      export type $6 = Components.Parameters.Meta;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Files[];
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace GetFolder {
    export namespace Parameters {
      export type $0 =
        /**
         * example:
         * 8cbb43fe-4cdf-4991-8352-c461779cec02
         */
        Components.Parameters.UUId;
      export type $1 = Components.Parameters.Fields;
      export type $2 = Components.Parameters.Meta;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Folders;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace GetFolders {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Limit;
      export type $2 = Components.Parameters.Offset;
      export type $3 = Components.Parameters.Sort;
      export type $4 = Components.Parameters.Filter;
      export type $5 = Components.Parameters.Search;
      export type $6 = Components.Parameters.Meta;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Folders[];
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace GetInterfaces {
    export namespace Responses {
      export interface $200 {
        data?: {
          [key: string]: any;
        }[];
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace GetLayouts {
    export namespace Responses {
      export interface $200 {
        data?: {
          [key: string]: any;
        }[];
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace GetMe {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Meta;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Users;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace GetModules {
    export namespace Responses {
      export interface $200 {
        data?: {
          [key: string]: any;
        }[];
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace GetMyPermissions {
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Permissions[];
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace GetPermission {
    export namespace Parameters {
      export type $0 = Components.Parameters.Id;
      export type $1 = Components.Parameters.Fields;
      export type $2 = Components.Parameters.Meta;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Permissions;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace GetPermissions {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Limit;
      export type $2 = Components.Parameters.Offset;
      export type $3 = Components.Parameters.Meta;
      export type $4 = Components.Parameters.Sort;
      export type $5 = Components.Parameters.Filter;
      export type $6 = Components.Parameters.Search;
      export type $7 = Components.Parameters.Page;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Permissions[];
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace GetPreset {
    export namespace Parameters {
      export type $0 = Components.Parameters.Id;
      export type $1 = Components.Parameters.Fields;
      export type $2 = Components.Parameters.Meta;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Presets;
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace GetPresets {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Limit;
      export type $2 = Components.Parameters.Offset;
      export type $3 = Components.Parameters.Page;
      export type $4 = Components.Parameters.Sort;
      export type $5 = Components.Parameters.Filter;
      export type $6 = Components.Parameters.Search;
      export type $7 = Components.Parameters.Meta;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Presets[];
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace GetRelation {
    export namespace Parameters {
      export type $0 = Components.Parameters.Id;
      export type $1 = Components.Parameters.Fields;
      export type $2 = Components.Parameters.Meta;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Relations;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace GetRelations {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Limit;
      export type $2 = Components.Parameters.Offset;
      export type $3 = Components.Parameters.Meta;
      export type $4 = Components.Parameters.Sort;
      export type $5 = Components.Parameters.Filter;
      export type $6 = Components.Parameters.Search;
      export type $7 = Components.Parameters.Page;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Relations[];
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace GetRevision {
    export namespace Parameters {
      export type $0 = Components.Parameters.Id;
      export type $1 = Components.Parameters.Fields;
      export type $2 = Components.Parameters.Meta;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Revisions;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace GetRevisions {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Limit;
      export type $2 = Components.Parameters.Offset;
      export type $3 = Components.Parameters.Meta;
      export type $4 = Components.Parameters.Sort;
      export type $5 = Components.Parameters.Filter;
      export type $6 = Components.Parameters.Search;
      export type $7 = Components.Parameters.Page;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Revisions[];
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace GetRole {
    export namespace Parameters {
      export type $0 =
        /**
         * example:
         * 8cbb43fe-4cdf-4991-8352-c461779cec02
         */
        Components.Parameters.UUId;
      export type $1 = Components.Parameters.Fields;
      export type $2 = Components.Parameters.Meta;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Roles;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace GetRoles {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Limit;
      export type $2 = Components.Parameters.Offset;
      export type $3 = Components.Parameters.Meta;
      export type $4 = Components.Parameters.Sort;
      export type $5 = Components.Parameters.Filter;
      export type $6 = Components.Parameters.Search;
      export type $7 = Components.Parameters.Page;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Roles[];
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace GetSettings {
    export namespace Parameters {
      export type $0 = Components.Parameters.Limit;
      export type $1 = Components.Parameters.Offset;
      export type $2 = Components.Parameters.Meta;
      export type $3 = Components.Parameters.Page;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Settings;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace GetUser {
    export namespace Parameters {
      export type $0 =
        /**
         * example:
         * 8cbb43fe-4cdf-4991-8352-c461779cec02
         */
        Components.Parameters.UUId;
      export type $1 = Components.Parameters.Fields;
      export type $2 = Components.Parameters.Meta;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Users;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace GetUsers {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Limit;
      export type $2 = Components.Parameters.Offset;
      export type $3 = Components.Parameters.Meta;
      export type $4 = Components.Parameters.Sort;
      export type $5 = Components.Parameters.Filter;
      export type $6 = Components.Parameters.Search;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Users[];
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace GetWebhook {
    export namespace Parameters {
      export type $0 =
        /**
         * example:
         * 8cbb43fe-4cdf-4991-8352-c461779cec02
         */
        Components.Parameters.UUId;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Webhooks;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace GetWebhooks {
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Webhooks;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace Invite {
    export interface RequestBody {
      /**
       * Email address or array of email addresses of the to-be-invited user(s).
       */
      email?: string;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Users;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace Login {
    export interface RequestBody {
      /**
       * Email address of the user you're retrieving the access token for.
       * example:
       * admin@example.com
       */
      email: string;
      /**
       * Password of the user.
       * example:
       * password
       */
      password: string; // password
      /**
       * Choose between retrieving the token as a string, or setting it as a cookie.
       */
      mode?: "json" | "cookie";
      /**
       * If 2FA is enabled, you need to pass the one time password.
       */
      otp?: string;
    }
    export namespace Responses {
      export interface $200 {
        data?: {
          /**
           * example:
           * eyJhbGciOiJI...
           */
          access_token?: string;
          /**
           * example:
           * 900
           */
          expires?: number;
          /**
           * example:
           * yuOJkjdPXMd...
           */
          refresh_token?: string;
        };
      }
    }
  }
  export namespace Logout {
    export interface RequestBody {
      /**
       * JWT access token you want to logout.
       * example:
       * eyJ0eXAiOiJKV...
       */
      refresh_token?: string;
    }
    export namespace Responses {
      export interface $200 {}
    }
  }
  export namespace MeTfaDisable {
    export namespace Responses {
      export interface $200 {}
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace MeTfaEnable {
    export namespace Responses {
      export interface $200 {}
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace Oauth {
    export namespace Responses {
      export interface $200 {
        public?: boolean;
        /**
         * example:
         * [
         *   "github",
         *   "facebook"
         * ]
         */
        data?: string[];
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace OauthProvider {
    export namespace Parameters {
      export type Provider = string;
      export type Redirect = string;
    }
    export interface PathParameters {
      provider: Parameters.Provider;
    }
    export interface QueryParameters {
      redirect?: Parameters.Redirect;
    }
    export namespace Responses {
      export interface $200 {
        public?: boolean;
        data?: {
          token?: string;
        };
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace PasswordRequest {
    export interface RequestBody {
      /**
       * Email address of the user you're requesting a reset for.
       * example:
       * admin@example.com
       */
      email: string;

      reset_url: string;
    }
    export namespace Responses {
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace PasswordReset {
    export interface RequestBody {
      /**
       * One-time use JWT token that is used to verify the user.
       * example:
       * eyJ0eXAiOiJKV1Qi...
       */
      token: string;
      /**
       * New password for the user.
       * example:
       * password
       */
      password: string; // password
    }
    export namespace Responses {
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace Random {
    export namespace Parameters {
      export type Length = number;
    }
    export interface QueryParameters {
      length?: Parameters.Length;
    }
    export namespace Responses {
      export interface $200 {
        /**
         * example:
         * 1>M3+4oh.S
         */
        data?: string;
      }
    }
  }
  export namespace ReadItemsAgencies {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Limit;
      export type $2 = Components.Parameters.Meta;
      export type $3 = Components.Parameters.Offset;
      export type $4 = Components.Parameters.Sort;
      export type $5 = Components.Parameters.Filter;
      export type $6 = Components.Parameters.Search;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsAgencies[];
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace ReadItemsCalendar {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Limit;
      export type $2 = Components.Parameters.Meta;
      export type $3 = Components.Parameters.Offset;
      export type $4 = Components.Parameters.Sort;
      export type $5 = Components.Parameters.Filter;
      export type $6 = Components.Parameters.Search;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsCalendar[];
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace ReadItemsRealTime {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Limit;
      export type $2 = Components.Parameters.Meta;
      export type $3 = Components.Parameters.Offset;
      export type $4 = Components.Parameters.Sort;
      export type $5 = Components.Parameters.Filter;
      export type $6 = Components.Parameters.Search;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsRealTime[];
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace ReadItemsRoutes {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Limit;
      export type $2 = Components.Parameters.Meta;
      export type $3 = Components.Parameters.Offset;
      export type $4 = Components.Parameters.Sort;
      export type $5 = Components.Parameters.Filter;
      export type $6 = Components.Parameters.Search;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsRoutes[];
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace ReadItemsRtAlertTimes {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Limit;
      export type $2 = Components.Parameters.Meta;
      export type $3 = Components.Parameters.Offset;
      export type $4 = Components.Parameters.Sort;
      export type $5 = Components.Parameters.Filter;
      export type $6 = Components.Parameters.Search;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsRtAlertTimes[];
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace ReadItemsRtAlerts {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Limit;
      export type $2 = Components.Parameters.Meta;
      export type $3 = Components.Parameters.Offset;
      export type $4 = Components.Parameters.Sort;
      export type $5 = Components.Parameters.Filter;
      export type $6 = Components.Parameters.Search;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsRtAlerts[];
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace ReadItemsRtStopTimeUpdates {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Limit;
      export type $2 = Components.Parameters.Meta;
      export type $3 = Components.Parameters.Offset;
      export type $4 = Components.Parameters.Sort;
      export type $5 = Components.Parameters.Filter;
      export type $6 = Components.Parameters.Search;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsRtStopTimeUpdates[];
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace ReadItemsRtTripUpdates {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Limit;
      export type $2 = Components.Parameters.Meta;
      export type $3 = Components.Parameters.Offset;
      export type $4 = Components.Parameters.Sort;
      export type $5 = Components.Parameters.Filter;
      export type $6 = Components.Parameters.Search;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsRtTripUpdates[];
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace ReadItemsShapes {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Limit;
      export type $2 = Components.Parameters.Meta;
      export type $3 = Components.Parameters.Offset;
      export type $4 = Components.Parameters.Sort;
      export type $5 = Components.Parameters.Filter;
      export type $6 = Components.Parameters.Search;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsShapes[];
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace ReadItemsStopTimes {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Limit;
      export type $2 = Components.Parameters.Meta;
      export type $3 = Components.Parameters.Offset;
      export type $4 = Components.Parameters.Sort;
      export type $5 = Components.Parameters.Filter;
      export type $6 = Components.Parameters.Search;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsStopTimes[];
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace ReadItemsStops {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Limit;
      export type $2 = Components.Parameters.Meta;
      export type $3 = Components.Parameters.Offset;
      export type $4 = Components.Parameters.Sort;
      export type $5 = Components.Parameters.Filter;
      export type $6 = Components.Parameters.Search;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsStops[];
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace ReadItemsTickets {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Limit;
      export type $2 = Components.Parameters.Meta;
      export type $3 = Components.Parameters.Offset;
      export type $4 = Components.Parameters.Sort;
      export type $5 = Components.Parameters.Filter;
      export type $6 = Components.Parameters.Search;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsTickets[];
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace ReadItemsTrips {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Limit;
      export type $2 = Components.Parameters.Meta;
      export type $3 = Components.Parameters.Offset;
      export type $4 = Components.Parameters.Sort;
      export type $5 = Components.Parameters.Filter;
      export type $6 = Components.Parameters.Search;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsTrips[];
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace ReadItemsVehicles {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Limit;
      export type $2 = Components.Parameters.Meta;
      export type $3 = Components.Parameters.Offset;
      export type $4 = Components.Parameters.Sort;
      export type $5 = Components.Parameters.Filter;
      export type $6 = Components.Parameters.Search;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsVehicles[];
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace ReadSingleItemsAgencies {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Meta;
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsAgencies;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace ReadSingleItemsCalendar {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Meta;
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsCalendar;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace ReadSingleItemsRealTime {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Meta;
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsRealTime;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace ReadSingleItemsRoutes {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Meta;
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsRoutes;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace ReadSingleItemsRtAlertTimes {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Meta;
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsRtAlertTimes;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace ReadSingleItemsRtAlerts {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Meta;
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsRtAlerts;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace ReadSingleItemsRtStopTimeUpdates {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Meta;
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsRtStopTimeUpdates;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace ReadSingleItemsRtTripUpdates {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Meta;
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsRtTripUpdates;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace ReadSingleItemsShapes {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Meta;
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsShapes;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace ReadSingleItemsStopTimes {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Meta;
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsStopTimes;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace ReadSingleItemsStops {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Meta;
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsStops;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace ReadSingleItemsTickets {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Meta;
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsTickets;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace ReadSingleItemsTrips {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Meta;
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsTrips;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace ReadSingleItemsVehicles {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Meta;
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsVehicles;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace Refresh {
    export interface RequestBody {
      /**
       * JWT access token you want to refresh. This token can't be expired.
       * example:
       * eyJ0eXAiOiJKV...
       */
      refresh_token?: string;
    }
    export namespace Responses {
      export interface $200 {
        data?: {
          /**
           * example:
           * eyJhbGciOiJI...
           */
          access_token?: string;
          /**
           * example:
           * 900
           */
          expires?: number;
          /**
           * example:
           * Gy-caJMpmGTA...
           */
          refresh_token?: string;
        };
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace ServerInfo {
    export namespace Parameters {
      export type SuperAdminToken = number;
    }
    export interface QueryParameters {
      super_admin_token: Parameters.SuperAdminToken;
    }
    export namespace Responses {
      export interface $200 {
        data?: {
          [key: string]: any;
        };
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace Sort {
    export namespace Parameters {
      export type Collection = string;
    }
    export interface PathParameters {
      collection: Parameters.Collection;
    }
    export interface RequestBody {
      /**
       * Primary key of item to move
       */
      item?: number;
      /**
       * Primary key of item where to move the current item to
       */
      to?: number;
    }
    export namespace Responses {
      export interface $200 {}
    }
  }
  export namespace UpdateCollection {
    export namespace Parameters {
      export type $1 = Components.Parameters.Meta;
      export type Id = string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export interface RequestBody {
      /**
       * Metadata of the collection.
       */
      meta?: {
        /**
         * Name of a Google Material Design Icon that's assigned to this collection.
         * example:
         * people
         */
        icon?: string | null;
        /**
         * Choose the color for the icon assigned to this collection.
         * example:
         * #6644ff
         */
        color?: string | null;
        /**
         * A note describing the collection.
         * example:
         */
        note?: string | null;
        /**
         * Text representation of how items from this collection are shown across the system.
         * example:
         */
        display_template?: string | null;
        /**
         * Whether or not the collection is hidden from the navigation in the admin app.
         * example:
         * false
         */
        hidden?: boolean;
        /**
         * Whether or not the collection is treated as a single object.
         * example:
         * false
         */
        singleton?: boolean;
        /**
         * Key value pairs of how to show this collection's name in different languages in the admin app.
         * example:
         */
        translation?: string | null;
        /**
         * What field holds the archive value.
         * example:
         */
        archive_field?: string | null;
        /**
         * What value to use for "archived" items.
         * example:
         */
        archive_app_filter?: string | null;
        /**
         * What value to use to "unarchive" items.
         * example:
         */
        archive_value?: string | null;
        /**
         * Whether or not to show the "archived" filter.
         * example:
         */
        unarchive_value?: string | null;
        /**
         * The sort field in the collection.
         * example:
         */
        sort_field?: string | null;
      };
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Collections;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace UpdateComment {
    export namespace Parameters {
      export type $0 = Components.Parameters.Id;
      export type $1 = Components.Parameters.Meta;
    }
    export interface RequestBody {
      /**
       * example:
       * My updated comment
       */
      comment?: string;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Activity;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace UpdateField {
    export namespace Parameters {
      export type Collection = string;
      export type Id = string;
    }
    export interface PathParameters {
      collection: Parameters.Collection;
      id: Parameters.Id;
    }
    export interface RequestBody {
      /**
       * Unique name of the field. Field name is unique within the collection.
       * example:
       * id
       */
      field?: string;
      /**
       * Directus specific data type. Used to cast values in the API.
       * example:
       * integer
       */
      type?: string;
      /**
       * The schema info.
       */
      schema?: {
        /**
         * The name of the field.
         * example:
         * title
         */
        name?: string;
        /**
         * The collection of the field.
         * example:
         * posts
         */
        table?: string;
        /**
         * The type of the field.
         * example:
         * string
         */
        type?: string;
        /**
         * The default value of the field.
         * example:
         */
        default_value?: string | null;
        /**
         * The max length of the field.
         * example:
         */
        max_length?: null | number;
        /**
         * If the field is nullable.
         * example:
         * false
         */
        is_nullable?: boolean;
        /**
         * If the field is primary key.
         * example:
         * false
         */
        is_primary_key?: boolean;
        /**
         * If the field has auto increment.
         * example:
         * false
         */
        has_auto_increment?: boolean;
        /**
         * Related column from the foreign key constraint.
         * example:
         */
        foreign_key_column?: string | null;
        /**
         * Related table from the foreign key constraint.
         * example:
         */
        foreign_key_table?: string | null;
        /**
         * Comment as saved in the database.
         * example:
         */
        comment?: string | null;
        /**
         * Database schema (pg only).
         * example:
         * public
         */
        schema?: string;
        /**
         * Related schema from the foreign key constraint (pg only).
         * example:
         */
        foreign_key_schema?: string | null;
      };
      /**
       * The meta info.
       */
      meta?: {
        /**
         * Unique identifier for the field in the `directus_fields` collection.
         * example:
         * 3
         */
        id?: number;
        /**
         * Unique name of the collection this field is in.
         * example:
         * posts
         */
        collection?: string;
        /**
         * Unique name of the field. Field name is unique within the collection.
         * example:
         * title
         */
        field?: string;
        /**
         * Transformation flag for field
         * example:
         */
        special?: string[] | null;
        /**
         * What interface is used in the admin app to edit the value for this field.
         * example:
         * primary-key
         */
        "system-interface"?: string | null;
        /**
         * Options for the interface that's used. This format is based on the individual interface.
         * example:
         */
        options?: {
          [key: string]: any;
        } | null;
        /**
         * What display is used in the admin app to display the value for this field.
         * example:
         */
        display?: string | null;
        /**
         * Options for the display that's used. This format is based on the individual display.
         * example:
         */
        display_options?: {
          [key: string]: any;
        } | null;
        /**
         * If the field can be altered by the end user. Directus system fields have this value set to `true`.
         * example:
         * true
         */
        locked?: boolean;
        /**
         * Prevents the user from editing the value in the field.
         * example:
         * false
         */
        readonly?: boolean;
        /**
         * If this field should be hidden.
         * example:
         * true
         */
        hidden?: boolean;
        /**
         * Sort order of this field on the edit page of the admin app.
         * example:
         * 1
         */
        sort?: null | number;
        /**
         * Width of the field on the edit form.
         * example:
         */
        width?: "half" | "half-left" | "half-right" | "full" | "fill" | null;
        /**
         * What field group this field is part of.
         * example:
         */
        group?: null | number;
        /**
         * Key value pair of `<language>: <translation>` that allows the user to change the displayed name of the field in the admin app.
         * example:
         */
        translation?: {
          [key: string]: any;
        } | null;
        /**
         * A user provided note for the field. Will be rendered alongside the interface on the edit page.
         * example:
         *
         */
        note?: string | null;
      } | null;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Fields;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace UpdateFile {
    export namespace Parameters {
      export type $0 =
        /**
         * example:
         * 8cbb43fe-4cdf-4991-8352-c461779cec02
         */
        Components.Parameters.UUId;
      export type $1 = Components.Parameters.Fields;
      export type $2 = Components.Parameters.Meta;
    }
    export interface RequestBody {
      /**
       * Title for the file. Is extracted from the filename on upload, but can be edited by the user.
       * example:
       * User Avatar
       */
      title?: string;
      /**
       * Preferred filename when file is downloaded.
       */
      filename_download?: string;
      /**
       * Description for the file.
       */
      description?: string | null;
      /**
       * Virtual folder where this file resides in.
       * example:
       */
      folder?: /**
       * Virtual folder where this file resides in.
       * example:
       */
      null | Components.Schemas.Folders;
      /**
       * Tags for the file. Is automatically populated based on EXIF data for images.
       */
      tags?: string[] | null;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Files;
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace UpdateFolder {
    export namespace Parameters {
      export type $0 =
        /**
         * example:
         * 8cbb43fe-4cdf-4991-8352-c461779cec02
         */
        Components.Parameters.UUId;
      export type $1 = Components.Parameters.Fields;
      export type $2 = Components.Parameters.Meta;
    }
    export interface RequestBody {
      /**
       * Name of the folder. Can't be null or empty.
       */
      name?: string;
      /**
       * Unique identifier of the parent folder. This allows for nested folders.
       * example:
       * 3
       */
      parent?: number;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Folders;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace UpdateLastUsedPageMe {
    export interface RequestBody {
      /**
       * Path of the page you used last.
       */
      last_page?: string;
    }
    export namespace Responses {
      export interface $200 {}
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace UpdateMe {
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Users;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace UpdatePermission {
    export namespace Parameters {
      export type $0 = Components.Parameters.Id;
      export type $1 = Components.Parameters.Meta;
    }
    export interface RequestBody {
      /**
       * What collection this permission applies to.
       */
      collection?: {
        [key: string]: any;
      };
      /**
       * If the user can post comments. `full`.
       */
      comment?: "none" | "create" | "update";
      /**
       * If the user can create items.
       */
      create?: "none" | "full";
      /**
       * If the user can update items.
       */
      delete?: "none" | "mine" | "role" | "full";
      /**
       * If the user is required to leave a comment explaining what was changed.
       */
      explain?: "none" | "create" | "update" | "always";
      /**
       * If the user can read items.
       */
      read?: "none" | "mine" | "role" | "full";
      /**
       * Explicitly denies read access for specific fields.
       */
      read_field_blacklist?: {
        [key: string]: any;
      };
      /**
       * Unique identifier of the role this permission applies to.
       */
      role?: {
        [key: string]: any;
      };
      /**
       * What status this permission applies to.
       */
      status?: {
        [key: string]: any;
      };
      /**
       * Explicitly denies specific statuses to be used.
       */
      status_blacklist?: {
        [key: string]: any;
      };
      /**
       * If the user can update items.
       */
      update?: "none" | "mine" | "role" | "full";
      /**
       * Explicitly denies write access for specific fields.
       */
      write_field_blacklist?: {
        [key: string]: any;
      };
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Permissions;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace UpdatePreset {
    export namespace Parameters {
      export type $0 = Components.Parameters.Id;
      export type $1 = Components.Parameters.Fields;
      export type $2 = Components.Parameters.Meta;
    }
    export interface RequestBody {
      /**
       * What collection this collection preset is used for.
       * example:
       * articles
       */
      collection: string;
      /**
       * Name for the bookmark. If this is set, the collection preset will be considered to be a bookmark.
       * example:
       * Highly rated articles
       */
      title?: string;
      /**
       * The unique identifier of a role in the platform. If user is null, this will be used to apply the collection preset or bookmark for all users in the role.
       */
      role?: number;
      /**
       * What the user searched for in search/filter in the header bar.
       */
      search_query?: string;
      filters?: {
        /**
         * example:
         * rating
         */
        field?: string;
        /**
         * example:
         * gte
         */
        operator?: string;
        /**
         * example:
         * 4.5
         */
        value?: number;
      }[];
      /**
       * Name of the view type that is used. Defaults to tabular.
       */
      view_type?: string;
      /**
       * View query that's saved per view type. Controls what data is fetched on load. These follow the same format as the JS SDK parameters.
       */
      view_query?: string;
      /**
       * Options of the views. The properties in here are controlled by the layout.
       */
      view_options?: string;
      /**
       * Key value pair of language-translation. Can be used to translate the bookmark title in multiple languages.
       */
      translation?: {
        [key: string]: any;
      };
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Presets;
      }
      export type $401 = Components.Responses.UnauthorizedError;
    }
  }
  export namespace UpdateRelation {
    export namespace Parameters {
      export type $0 = Components.Parameters.Id;
      export type $1 = Components.Parameters.Fields;
      export type $2 = Components.Parameters.Meta;
    }
    export interface RequestBody {
      /**
       * Collection that has the field that holds the foreign key.
       */
      collection_many?: string;
      /**
       * Collection on the _one_ side of the relationship.
       */
      collection_one?: string;
      /**
       * Foreign key. Field that holds the primary key of the related collection.
       */
      field_many?: string;
      /**
       * Alias column that serves as the _one_ side of the relationship.
       * example:
       * books
       */
      field_one?: string;
      /**
       * Field on the junction table that holds the primary key of the related collection.
       */
      junction_field?: string;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Relations;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace UpdateRole {
    export namespace Parameters {
      export type $0 =
        /**
         * example:
         * 8cbb43fe-4cdf-4991-8352-c461779cec02
         */
        Components.Parameters.UUId;
      export type $1 = Components.Parameters.Fields;
      export type $2 = Components.Parameters.Meta;
    }
    export interface RequestBody {
      /**
       * Description of the role.
       */
      description?: string;
      /**
       * Whether or not this role enforces the use of 2FA.
       */
      enforce_2fa?: boolean;
      /**
       * ID used with external services in SCIM.
       */
      external_id?: string;
      /**
       * Array of IP addresses that are allowed to connect to the API as a user of this role.
       */
      ip_whitelist?: string[];
      /**
       * Custom override for the admin app module bar navigation.
       */
      module_listing?: string;
      /**
       * Name of the role.
       */
      name?: string;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Roles;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace UpdateSetting {
    export interface RequestBody {}
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Settings;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace UpdateSingleItemsAgencies {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Meta;
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export type RequestBody = Components.Schemas.ItemsAgencies;
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsAgencies;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace UpdateSingleItemsCalendar {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Meta;
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export type RequestBody = Components.Schemas.ItemsCalendar;
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsCalendar;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace UpdateSingleItemsRealTime {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Meta;
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export type RequestBody = Components.Schemas.ItemsRealTime;
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsRealTime;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace UpdateSingleItemsRoutes {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Meta;
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export type RequestBody = Components.Schemas.ItemsRoutes;
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsRoutes;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace UpdateSingleItemsRtAlertTimes {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Meta;
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export type RequestBody = Components.Schemas.ItemsRtAlertTimes;
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsRtAlertTimes;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace UpdateSingleItemsRtAlerts {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Meta;
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export type RequestBody = Components.Schemas.ItemsRtAlerts;
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsRtAlerts;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace UpdateSingleItemsRtStopTimeUpdates {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Meta;
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export type RequestBody = Components.Schemas.ItemsRtStopTimeUpdates;
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsRtStopTimeUpdates;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace UpdateSingleItemsRtTripUpdates {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Meta;
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export type RequestBody = Components.Schemas.ItemsRtTripUpdates;
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsRtTripUpdates;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace UpdateSingleItemsShapes {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Meta;
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export type RequestBody = Components.Schemas.ItemsShapes;
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsShapes;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace UpdateSingleItemsStopTimes {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Meta;
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export type RequestBody = Components.Schemas.ItemsStopTimes;
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsStopTimes;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace UpdateSingleItemsStops {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Meta;
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export type RequestBody = Components.Schemas.ItemsStops;
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsStops;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace UpdateSingleItemsTickets {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Meta;
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export type RequestBody = Components.Schemas.ItemsTickets;
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsTickets;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace UpdateSingleItemsTrips {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Meta;
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export type RequestBody = Components.Schemas.ItemsTrips;
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsTrips;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace UpdateSingleItemsVehicles {
    export namespace Parameters {
      export type $0 = Components.Parameters.Fields;
      export type $1 = Components.Parameters.Meta;
      export type Id = number | string;
    }
    export interface PathParameters {
      id: Parameters.Id;
    }
    export type RequestBody = Components.Schemas.ItemsVehicles;
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.ItemsVehicles;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace UpdateUser {
    export namespace Parameters {
      export type $0 =
        /**
         * example:
         * 8cbb43fe-4cdf-4991-8352-c461779cec02
         */
        Components.Parameters.UUId;
      export type $1 = Components.Parameters.Fields;
      export type $2 = Components.Parameters.Meta;
    }
    export type RequestBody = Components.Schemas.Users;
    export namespace Responses {
      export interface $200 {
        data?: {
          [key: string]: any;
        };
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
  export namespace UpdateWebhook {
    export namespace Parameters {
      export type $0 =
        /**
         * example:
         * 8cbb43fe-4cdf-4991-8352-c461779cec02
         */
        Components.Parameters.UUId;
      export type $1 = Components.Parameters.Fields;
      export type $2 = Components.Parameters.Meta;
    }
    export interface RequestBody {
      /**
       * The name of the webhook.
       * example:
       * create articles
       */
      name?: string;
      /**
       * Method used in the webhook.
       * example:
       * POST
       */
      method?: string;
      /**
       * The url of the webhook.
       * example:
       */
      url?: string;
      /**
       * The status of the webhook.
       * example:
       * active
       */
      status?: string;
      /**
       * If yes, send the content of what was done
       * example:
       * true
       */
      data?: boolean;
      /**
       * The actions that triggers this webhook.
       * example:
       */
      actions?: any;
      /**
       * The collections that triggers this webhook.
       * example:
       */
      "system-collections"?: any;
    }
    export namespace Responses {
      export interface $200 {
        data?: Components.Schemas.Roles;
      }
      export type $401 = Components.Responses.UnauthorizedError;
      export type $404 = Components.Responses.NotFoundError;
    }
  }
}

export interface OperationMethods {
  /**
   * getAsset - Get an Asset
   *
   * Image typed files can be dynamically resized and transformed to fit any need.
   */
  "getAsset"(
    parameters?: Parameters<
      Paths.GetAsset.PathParameters & Paths.GetAsset.QueryParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetAsset.Responses.$200>;
  /**
   * login - Retrieve a Temporary Access Token
   *
   * Retrieve a Temporary Access Token
   */
  "login"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.Login.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.Login.Responses.$200>;
  /**
   * refresh - Refresh Token
   *
   * Refresh a Temporary Access Token.
   */
  "refresh"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.Refresh.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.Refresh.Responses.$200>;
  /**
   * logout - Log Out
   *
   * Log Out
   */
  "logout"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.Logout.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.Logout.Responses.$200>;
  /**
   * passwordRequest - Request a Password Reset
   *
   * Request a reset password email to be send.
   */
  "passwordRequest"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PasswordRequest.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<any>;
  /**
   * passwordReset - Reset a Password
   *
   * The request a password reset endpoint sends an email with a link to the admin app which in turn uses this endpoint to allow the user to reset their password.
   */
  "passwordReset"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PasswordReset.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<any>;
  /**
   * oauth - List OAuth Providers
   *
   * List configured OAuth providers.
   */
  "oauth"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.Oauth.Responses.$200>;
  /**
   * oauthProvider - Authenticated using an OAuth provider
   *
   * Start OAuth flow using the specified provider
   */
  "oauthProvider"(
    parameters?: Parameters<
      Paths.OauthProvider.PathParameters & Paths.OauthProvider.QueryParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.OauthProvider.Responses.$200>;
  /**
   * getInterfaces - List Interfaces
   *
   * List all installed custom interfaces.
   */
  "getInterfaces"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetInterfaces.Responses.$200>;
  /**
   * getLayouts - List Layouts
   *
   * List all installed custom layouts.
   */
  "getLayouts"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetLayouts.Responses.$200>;
  /**
   * getDisplays - List Displays
   *
   * List all installed custom displays.
   */
  "getDisplays"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetDisplays.Responses.$200>;
  /**
   * getModules - List Modules
   *
   * List all installed custom modules.
   */
  "getModules"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetModules.Responses.$200>;
  /**
   * serverInfo - System Info
   *
   * Perform a system status check and return the options.
   */
  "serverInfo"(
    parameters?: Parameters<Paths.ServerInfo.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ServerInfo.Responses.$200>;
  /**
   * ping - Ping
   *
   * Ping, pong. Ping.. pong.
   */
  "ping"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<any>;
  /**
   * random - Get a Random String
   *
   * Returns a random string of given length.
   */
  "random"(
    parameters?: Parameters<Paths.Random.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.Random.Responses.$200>;
  /**
   * sort - Sort Items
   *
   * Re-sort items in collection based on start and to value of item
   */
  "sort"(
    parameters?: Parameters<Paths.Sort.PathParameters> | null,
    data?: Paths.Sort.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.Sort.Responses.$200>;
  /**
   * readItemsRealTime - List Items
   *
   * List the RealTime items.
   */
  "readItemsRealTime"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ReadItemsRealTime.Responses.$200>;
  /**
   * createItemsRealTime - Create an Item
   *
   * Create a new RealTime item.
   */
  "createItemsRealTime"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateItemsRealTime.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateItemsRealTime.Responses.$200>;
  /**
   * readSingleItemsRealTime - Retrieve an Item
   *
   * Retrieve a single RealTime item by unique identifier.
   */
  "readSingleItemsRealTime"(
    parameters?: Parameters<Paths.ReadSingleItemsRealTime.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ReadSingleItemsRealTime.Responses.$200>;
  /**
   * updateSingleItemsRealTime - Update an Item
   *
   * Update an existing RealTime item.
   */
  "updateSingleItemsRealTime"(
    parameters?: Parameters<Paths.UpdateSingleItemsRealTime.PathParameters> | null,
    data?: Paths.UpdateSingleItemsRealTime.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateSingleItemsRealTime.Responses.$200>;
  /**
   * deleteSingleItemsRealTime - Delete an Item
   *
   * Delete an existing RealTime item.
   */
  "deleteSingleItemsRealTime"(
    parameters?: Parameters<Paths.DeleteSingleItemsRealTime.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeleteSingleItemsRealTime.Responses.$200>;
  /**
   * readItemsAgencies - List Items
   *
   * List the agencies items.
   */
  "readItemsAgencies"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ReadItemsAgencies.Responses.$200>;
  /**
   * createItemsAgencies - Create an Item
   *
   * Create a new agencies item.
   */
  "createItemsAgencies"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateItemsAgencies.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateItemsAgencies.Responses.$200>;
  /**
   * readSingleItemsAgencies - Retrieve an Item
   *
   * Retrieve a single agencies item by unique identifier.
   */
  "readSingleItemsAgencies"(
    parameters?: Parameters<Paths.ReadSingleItemsAgencies.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ReadSingleItemsAgencies.Responses.$200>;
  /**
   * updateSingleItemsAgencies - Update an Item
   *
   * Update an existing agencies item.
   */
  "updateSingleItemsAgencies"(
    parameters?: Parameters<Paths.UpdateSingleItemsAgencies.PathParameters> | null,
    data?: Paths.UpdateSingleItemsAgencies.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateSingleItemsAgencies.Responses.$200>;
  /**
   * deleteSingleItemsAgencies - Delete an Item
   *
   * Delete an existing agencies item.
   */
  "deleteSingleItemsAgencies"(
    parameters?: Parameters<Paths.DeleteSingleItemsAgencies.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeleteSingleItemsAgencies.Responses.$200>;
  /**
   * readItemsCalendar - List Items
   *
   * List the calendar items.
   */
  "readItemsCalendar"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ReadItemsCalendar.Responses.$200>;
  /**
   * createItemsCalendar - Create an Item
   *
   * Create a new calendar item.
   */
  "createItemsCalendar"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateItemsCalendar.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateItemsCalendar.Responses.$200>;
  /**
   * readSingleItemsCalendar - Retrieve an Item
   *
   * Retrieve a single calendar item by unique identifier.
   */
  "readSingleItemsCalendar"(
    parameters?: Parameters<Paths.ReadSingleItemsCalendar.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ReadSingleItemsCalendar.Responses.$200>;
  /**
   * updateSingleItemsCalendar - Update an Item
   *
   * Update an existing calendar item.
   */
  "updateSingleItemsCalendar"(
    parameters?: Parameters<Paths.UpdateSingleItemsCalendar.PathParameters> | null,
    data?: Paths.UpdateSingleItemsCalendar.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateSingleItemsCalendar.Responses.$200>;
  /**
   * deleteSingleItemsCalendar - Delete an Item
   *
   * Delete an existing calendar item.
   */
  "deleteSingleItemsCalendar"(
    parameters?: Parameters<Paths.DeleteSingleItemsCalendar.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeleteSingleItemsCalendar.Responses.$200>;
  /**
   * readItemsRoutes - List Items
   *
   * List the routes items.
   */
  "readItemsRoutes"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ReadItemsRoutes.Responses.$200>;
  /**
   * createItemsRoutes - Create an Item
   *
   * Create a new routes item.
   */
  "createItemsRoutes"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateItemsRoutes.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateItemsRoutes.Responses.$200>;
  /**
   * readSingleItemsRoutes - Retrieve an Item
   *
   * Retrieve a single routes item by unique identifier.
   */
  "readSingleItemsRoutes"(
    parameters?: Parameters<Paths.ReadSingleItemsRoutes.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ReadSingleItemsRoutes.Responses.$200>;
  /**
   * updateSingleItemsRoutes - Update an Item
   *
   * Update an existing routes item.
   */
  "updateSingleItemsRoutes"(
    parameters?: Parameters<Paths.UpdateSingleItemsRoutes.PathParameters> | null,
    data?: Paths.UpdateSingleItemsRoutes.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateSingleItemsRoutes.Responses.$200>;
  /**
   * deleteSingleItemsRoutes - Delete an Item
   *
   * Delete an existing routes item.
   */
  "deleteSingleItemsRoutes"(
    parameters?: Parameters<Paths.DeleteSingleItemsRoutes.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeleteSingleItemsRoutes.Responses.$200>;
  /**
   * readItemsRtAlertTimes - List Items
   *
   * List the rt_alert_times items.
   */
  "readItemsRtAlertTimes"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ReadItemsRtAlertTimes.Responses.$200>;
  /**
   * createItemsRtAlertTimes - Create an Item
   *
   * Create a new rt_alert_times item.
   */
  "createItemsRtAlertTimes"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateItemsRtAlertTimes.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateItemsRtAlertTimes.Responses.$200>;
  /**
   * readSingleItemsRtAlertTimes - Retrieve an Item
   *
   * Retrieve a single rt_alert_times item by unique identifier.
   */
  "readSingleItemsRtAlertTimes"(
    parameters?: Parameters<Paths.ReadSingleItemsRtAlertTimes.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ReadSingleItemsRtAlertTimes.Responses.$200>;
  /**
   * updateSingleItemsRtAlertTimes - Update an Item
   *
   * Update an existing rt_alert_times item.
   */
  "updateSingleItemsRtAlertTimes"(
    parameters?: Parameters<Paths.UpdateSingleItemsRtAlertTimes.PathParameters> | null,
    data?: Paths.UpdateSingleItemsRtAlertTimes.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateSingleItemsRtAlertTimes.Responses.$200>;
  /**
   * deleteSingleItemsRtAlertTimes - Delete an Item
   *
   * Delete an existing rt_alert_times item.
   */
  "deleteSingleItemsRtAlertTimes"(
    parameters?: Parameters<Paths.DeleteSingleItemsRtAlertTimes.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeleteSingleItemsRtAlertTimes.Responses.$200>;
  /**
   * readItemsRtAlerts - List Items
   *
   * List the rt_alerts items.
   */
  "readItemsRtAlerts"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ReadItemsRtAlerts.Responses.$200>;
  /**
   * createItemsRtAlerts - Create an Item
   *
   * Create a new rt_alerts item.
   */
  "createItemsRtAlerts"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateItemsRtAlerts.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateItemsRtAlerts.Responses.$200>;
  /**
   * readSingleItemsRtAlerts - Retrieve an Item
   *
   * Retrieve a single rt_alerts item by unique identifier.
   */
  "readSingleItemsRtAlerts"(
    parameters?: Parameters<Paths.ReadSingleItemsRtAlerts.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ReadSingleItemsRtAlerts.Responses.$200>;
  /**
   * updateSingleItemsRtAlerts - Update an Item
   *
   * Update an existing rt_alerts item.
   */
  "updateSingleItemsRtAlerts"(
    parameters?: Parameters<Paths.UpdateSingleItemsRtAlerts.PathParameters> | null,
    data?: Paths.UpdateSingleItemsRtAlerts.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateSingleItemsRtAlerts.Responses.$200>;
  /**
   * deleteSingleItemsRtAlerts - Delete an Item
   *
   * Delete an existing rt_alerts item.
   */
  "deleteSingleItemsRtAlerts"(
    parameters?: Parameters<Paths.DeleteSingleItemsRtAlerts.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeleteSingleItemsRtAlerts.Responses.$200>;
  /**
   * readItemsRtStopTimeUpdates - List Items
   *
   * List the rt_stop_time_updates items.
   */
  "readItemsRtStopTimeUpdates"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ReadItemsRtStopTimeUpdates.Responses.$200>;
  /**
   * createItemsRtStopTimeUpdates - Create an Item
   *
   * Create a new rt_stop_time_updates item.
   */
  "createItemsRtStopTimeUpdates"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateItemsRtStopTimeUpdates.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateItemsRtStopTimeUpdates.Responses.$200>;
  /**
   * readSingleItemsRtStopTimeUpdates - Retrieve an Item
   *
   * Retrieve a single rt_stop_time_updates item by unique identifier.
   */
  "readSingleItemsRtStopTimeUpdates"(
    parameters?: Parameters<Paths.ReadSingleItemsRtStopTimeUpdates.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ReadSingleItemsRtStopTimeUpdates.Responses.$200>;
  /**
   * updateSingleItemsRtStopTimeUpdates - Update an Item
   *
   * Update an existing rt_stop_time_updates item.
   */
  "updateSingleItemsRtStopTimeUpdates"(
    parameters?: Parameters<Paths.UpdateSingleItemsRtStopTimeUpdates.PathParameters> | null,
    data?: Paths.UpdateSingleItemsRtStopTimeUpdates.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateSingleItemsRtStopTimeUpdates.Responses.$200>;
  /**
   * deleteSingleItemsRtStopTimeUpdates - Delete an Item
   *
   * Delete an existing rt_stop_time_updates item.
   */
  "deleteSingleItemsRtStopTimeUpdates"(
    parameters?: Parameters<Paths.DeleteSingleItemsRtStopTimeUpdates.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeleteSingleItemsRtStopTimeUpdates.Responses.$200>;
  /**
   * readItemsRtTripUpdates - List Items
   *
   * List the rt_trip_updates items.
   */
  "readItemsRtTripUpdates"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ReadItemsRtTripUpdates.Responses.$200>;
  /**
   * createItemsRtTripUpdates - Create an Item
   *
   * Create a new rt_trip_updates item.
   */
  "createItemsRtTripUpdates"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateItemsRtTripUpdates.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateItemsRtTripUpdates.Responses.$200>;
  /**
   * readSingleItemsRtTripUpdates - Retrieve an Item
   *
   * Retrieve a single rt_trip_updates item by unique identifier.
   */
  "readSingleItemsRtTripUpdates"(
    parameters?: Parameters<Paths.ReadSingleItemsRtTripUpdates.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ReadSingleItemsRtTripUpdates.Responses.$200>;
  /**
   * updateSingleItemsRtTripUpdates - Update an Item
   *
   * Update an existing rt_trip_updates item.
   */
  "updateSingleItemsRtTripUpdates"(
    parameters?: Parameters<Paths.UpdateSingleItemsRtTripUpdates.PathParameters> | null,
    data?: Paths.UpdateSingleItemsRtTripUpdates.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateSingleItemsRtTripUpdates.Responses.$200>;
  /**
   * deleteSingleItemsRtTripUpdates - Delete an Item
   *
   * Delete an existing rt_trip_updates item.
   */
  "deleteSingleItemsRtTripUpdates"(
    parameters?: Parameters<Paths.DeleteSingleItemsRtTripUpdates.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeleteSingleItemsRtTripUpdates.Responses.$200>;
  /**
   * readItemsShapes - List Items
   *
   * List the shapes items.
   */
  "readItemsShapes"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ReadItemsShapes.Responses.$200>;
  /**
   * createItemsShapes - Create an Item
   *
   * Create a new shapes item.
   */
  "createItemsShapes"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateItemsShapes.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateItemsShapes.Responses.$200>;
  /**
   * readSingleItemsShapes - Retrieve an Item
   *
   * Retrieve a single shapes item by unique identifier.
   */
  "readSingleItemsShapes"(
    parameters?: Parameters<Paths.ReadSingleItemsShapes.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ReadSingleItemsShapes.Responses.$200>;
  /**
   * updateSingleItemsShapes - Update an Item
   *
   * Update an existing shapes item.
   */
  "updateSingleItemsShapes"(
    parameters?: Parameters<Paths.UpdateSingleItemsShapes.PathParameters> | null,
    data?: Paths.UpdateSingleItemsShapes.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateSingleItemsShapes.Responses.$200>;
  /**
   * deleteSingleItemsShapes - Delete an Item
   *
   * Delete an existing shapes item.
   */
  "deleteSingleItemsShapes"(
    parameters?: Parameters<Paths.DeleteSingleItemsShapes.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeleteSingleItemsShapes.Responses.$200>;
  /**
   * readItemsStopTimes - List Items
   *
   * List the stop_times items.
   */
  "readItemsStopTimes"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ReadItemsStopTimes.Responses.$200>;
  /**
   * createItemsStopTimes - Create an Item
   *
   * Create a new stop_times item.
   */
  "createItemsStopTimes"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateItemsStopTimes.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateItemsStopTimes.Responses.$200>;
  /**
   * readSingleItemsStopTimes - Retrieve an Item
   *
   * Retrieve a single stop_times item by unique identifier.
   */
  "readSingleItemsStopTimes"(
    parameters?: Parameters<Paths.ReadSingleItemsStopTimes.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ReadSingleItemsStopTimes.Responses.$200>;
  /**
   * updateSingleItemsStopTimes - Update an Item
   *
   * Update an existing stop_times item.
   */
  "updateSingleItemsStopTimes"(
    parameters?: Parameters<Paths.UpdateSingleItemsStopTimes.PathParameters> | null,
    data?: Paths.UpdateSingleItemsStopTimes.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateSingleItemsStopTimes.Responses.$200>;
  /**
   * deleteSingleItemsStopTimes - Delete an Item
   *
   * Delete an existing stop_times item.
   */
  "deleteSingleItemsStopTimes"(
    parameters?: Parameters<Paths.DeleteSingleItemsStopTimes.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeleteSingleItemsStopTimes.Responses.$200>;
  /**
   * readItemsStops - List Items
   *
   * List the stops items.
   */
  "readItemsStops"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ReadItemsStops.Responses.$200>;
  /**
   * createItemsStops - Create an Item
   *
   * Create a new stops item.
   */
  "createItemsStops"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateItemsStops.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateItemsStops.Responses.$200>;
  /**
   * readSingleItemsStops - Retrieve an Item
   *
   * Retrieve a single stops item by unique identifier.
   */
  "readSingleItemsStops"(
    parameters?: Parameters<Paths.ReadSingleItemsStops.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ReadSingleItemsStops.Responses.$200>;
  /**
   * updateSingleItemsStops - Update an Item
   *
   * Update an existing stops item.
   */
  "updateSingleItemsStops"(
    parameters?: Parameters<Paths.UpdateSingleItemsStops.PathParameters> | null,
    data?: Paths.UpdateSingleItemsStops.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateSingleItemsStops.Responses.$200>;
  /**
   * deleteSingleItemsStops - Delete an Item
   *
   * Delete an existing stops item.
   */
  "deleteSingleItemsStops"(
    parameters?: Parameters<Paths.DeleteSingleItemsStops.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeleteSingleItemsStops.Responses.$200>;
  /**
   * readItemsTickets - List Items
   *
   * List the tickets items.
   */
  "readItemsTickets"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ReadItemsTickets.Responses.$200>;
  /**
   * createItemsTickets - Create an Item
   *
   * Create a new tickets item.
   */
  "createItemsTickets"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateItemsTickets.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateItemsTickets.Responses.$200>;
  /**
   * readSingleItemsTickets - Retrieve an Item
   *
   * Retrieve a single tickets item by unique identifier.
   */
  "readSingleItemsTickets"(
    parameters?: Parameters<Paths.ReadSingleItemsTickets.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ReadSingleItemsTickets.Responses.$200>;
  /**
   * updateSingleItemsTickets - Update an Item
   *
   * Update an existing tickets item.
   */
  "updateSingleItemsTickets"(
    parameters?: Parameters<Paths.UpdateSingleItemsTickets.PathParameters> | null,
    data?: Paths.UpdateSingleItemsTickets.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateSingleItemsTickets.Responses.$200>;
  /**
   * deleteSingleItemsTickets - Delete an Item
   *
   * Delete an existing tickets item.
   */
  "deleteSingleItemsTickets"(
    parameters?: Parameters<Paths.DeleteSingleItemsTickets.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeleteSingleItemsTickets.Responses.$200>;
  /**
   * readItemsTrips - List Items
   *
   * List the trips items.
   */
  "readItemsTrips"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ReadItemsTrips.Responses.$200>;
  /**
   * createItemsTrips - Create an Item
   *
   * Create a new trips item.
   */
  "createItemsTrips"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateItemsTrips.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateItemsTrips.Responses.$200>;
  /**
   * readSingleItemsTrips - Retrieve an Item
   *
   * Retrieve a single trips item by unique identifier.
   */
  "readSingleItemsTrips"(
    parameters?: Parameters<Paths.ReadSingleItemsTrips.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ReadSingleItemsTrips.Responses.$200>;
  /**
   * updateSingleItemsTrips - Update an Item
   *
   * Update an existing trips item.
   */
  "updateSingleItemsTrips"(
    parameters?: Parameters<Paths.UpdateSingleItemsTrips.PathParameters> | null,
    data?: Paths.UpdateSingleItemsTrips.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateSingleItemsTrips.Responses.$200>;
  /**
   * deleteSingleItemsTrips - Delete an Item
   *
   * Delete an existing trips item.
   */
  "deleteSingleItemsTrips"(
    parameters?: Parameters<Paths.DeleteSingleItemsTrips.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeleteSingleItemsTrips.Responses.$200>;
  /**
   * readItemsVehicles - List Items
   *
   * List the vehicles items.
   */
  "readItemsVehicles"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ReadItemsVehicles.Responses.$200>;
  /**
   * createItemsVehicles - Create an Item
   *
   * Create a new vehicles item.
   */
  "createItemsVehicles"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateItemsVehicles.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateItemsVehicles.Responses.$200>;
  /**
   * readSingleItemsVehicles - Retrieve an Item
   *
   * Retrieve a single vehicles item by unique identifier.
   */
  "readSingleItemsVehicles"(
    parameters?: Parameters<Paths.ReadSingleItemsVehicles.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.ReadSingleItemsVehicles.Responses.$200>;
  /**
   * updateSingleItemsVehicles - Update an Item
   *
   * Update an existing vehicles item.
   */
  "updateSingleItemsVehicles"(
    parameters?: Parameters<Paths.UpdateSingleItemsVehicles.PathParameters> | null,
    data?: Paths.UpdateSingleItemsVehicles.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateSingleItemsVehicles.Responses.$200>;
  /**
   * deleteSingleItemsVehicles - Delete an Item
   *
   * Delete an existing vehicles item.
   */
  "deleteSingleItemsVehicles"(
    parameters?: Parameters<Paths.DeleteSingleItemsVehicles.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeleteSingleItemsVehicles.Responses.$200>;
  /**
   * getActivities - List Activity Actions
   *
   * Returns a list of activity actions.
   */
  "getActivities"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetActivities.Responses.$200>;
  /**
   * createComment - Create a Comment
   *
   * Creates a new comment.
   */
  "createComment"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateComment.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateComment.Responses.$200>;
  /**
   * getActivity - Retrieve an Activity Action
   *
   * Retrieves the details of an existing activity action. Provide the primary key of the activity action and Directus will return the corresponding information.
   */
  "getActivity"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetActivity.Responses.$200>;
  /**
   * updateComment - Update a Comment
   *
   * Update the content of an existing comment.
   */
  "updateComment"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.UpdateComment.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateComment.Responses.$200>;
  /**
   * deleteComment - Delete a Comment
   *
   * Delete an existing comment. Deleted comments can not be retrieved.
   */
  "deleteComment"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeleteComment.Responses.$203>;
  /**
   * getCollections - List Collections
   *
   * Returns a list of the collections available in the project.
   */
  "getCollections"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetCollections.Responses.$200>;
  /**
   * createCollection - Create a Collection
   *
   * Create a new collection in Directus.
   */
  "createCollection"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateCollection.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateCollection.Responses.$200>;
  /**
   * getCollection - Retrieve a Collection
   *
   * Retrieves the details of a single collection.
   */
  "getCollection"(
    parameters?: Parameters<Paths.GetCollection.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetCollection.Responses.$200>;
  /**
   * updateCollection - Update a Collection
   *
   * Update an existing collection.
   */
  "updateCollection"(
    parameters?: Parameters<Paths.UpdateCollection.PathParameters> | null,
    data?: Paths.UpdateCollection.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateCollection.Responses.$200>;
  /**
   * deleteCollection - Delete a Collection
   *
   * Delete an existing collection. Warning: This will delete the whole collection, including the items within. Proceed with caution.
   */
  "deleteCollection"(
    parameters?: Parameters<Paths.DeleteCollection.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeleteCollection.Responses.$200>;
  /**
   * getFields - List All Fields
   *
   * Returns a list of the fields available in the project.
   */
  "getFields"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetFields.Responses.$200>;
  /**
   * getCollectionFields - List Fields in Collection
   *
   * Returns a list of the fields available in the given collection.
   */
  "getCollectionFields"(
    parameters?: Parameters<Paths.GetCollectionFields.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetCollectionFields.Responses.$200>;
  /**
   * createField - Create Field in Collection
   *
   * Create a new field in a given collection.
   */
  "createField"(
    parameters?: Parameters<Paths.CreateField.PathParameters> | null,
    data?: Paths.CreateField.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateField.Responses.$200>;
  /**
   * getCollectionField - Retrieve a Field
   *
   * Retrieves the details of a single field in a given collection.
   */
  "getCollectionField"(
    parameters?: Parameters<Paths.GetCollectionField.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetCollectionField.Responses.$200>;
  /**
   * updateField - Update a Field
   *
   * Update an existing field.
   */
  "updateField"(
    parameters?: Parameters<Paths.UpdateField.PathParameters> | null,
    data?: Paths.UpdateField.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateField.Responses.$200>;
  /**
   * deleteField - Delete a Field
   *
   * Delete an existing field.
   */
  "deleteField"(
    parameters?: Parameters<Paths.DeleteField.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeleteField.Responses.$200>;
  /**
   * getFiles - List Files
   *
   * List the files.
   */
  "getFiles"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetFiles.Responses.$200>;
  /**
   * createFile - Create a File
   *
   * Create a new file
   */
  "createFile"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateFile.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateFile.Responses.$200>;
  /**
   * getFile - Retrieve a Files
   *
   * Retrieve a single file by unique identifier.
   */
  "getFile"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetFile.Responses.$200>;
  /**
   * updateFile - Update a File
   *
   * Update an existing file, and/or replace it's file contents.
   */
  "updateFile"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.UpdateFile.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateFile.Responses.$200>;
  /**
   * deleteFile - Delete a File
   *
   * Delete an existing file.
   */
  "deleteFile"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeleteFile.Responses.$200>;
  /**
   * getFolders - List Folders
   *
   * List the folders.
   */
  "getFolders"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetFolders.Responses.$200>;
  /**
   * createFolder - Create a Folder
   *
   * Create a new folder.
   */
  "createFolder"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateFolder.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateFolder.Responses.$200>;
  /**
   * getFolder - Retrieve a Folder
   *
   * Retrieve a single folder by unique identifier.
   */
  "getFolder"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetFolder.Responses.$200>;
  /**
   * updateFolder - Update a Folder
   *
   * Update an existing folder
   */
  "updateFolder"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.UpdateFolder.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateFolder.Responses.$200>;
  /**
   * deleteFolder - Delete a Folder
   *
   * Delete an existing folder
   */
  "deleteFolder"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeleteFolder.Responses.$200>;
  /**
   * getPermissions - List Permissions
   *
   * List all permissions.
   */
  "getPermissions"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetPermissions.Responses.$200>;
  /**
   * createPermission - Create a Permission
   *
   * Create a new permission.
   */
  "createPermission"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreatePermission.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreatePermission.Responses.$200>;
  /**
   * getMyPermissions - List My Permissions
   *
   * List the permissions that apply to the current user.
   */
  "getMyPermissions"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetMyPermissions.Responses.$200>;
  /**
   * getPermission - Retrieve a Permission
   *
   * Retrieve a single permissions object by unique identifier.
   */
  "getPermission"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetPermission.Responses.$200>;
  /**
   * updatePermission - Update a Permission
   *
   * Update an existing permission
   */
  "updatePermission"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.UpdatePermission.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdatePermission.Responses.$200>;
  /**
   * deletePermission - Delete a Permission
   *
   * Delete an existing permission
   */
  "deletePermission"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeletePermission.Responses.$200>;
  /**
   * getPresets - List Presets
   *
   * List the presets.
   */
  "getPresets"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetPresets.Responses.$200>;
  /**
   * createPreset - Create a Preset
   *
   * Create a new preset.
   */
  "createPreset"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreatePreset.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreatePreset.Responses.$200>;
  /**
   * getPreset - Retrieve a Preset
   *
   * Retrieve a single preset by unique identifier.
   */
  "getPreset"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetPreset.Responses.$200>;
  /**
   * updatePreset - Update a Preset
   *
   * Update an existing preset.
   */
  "updatePreset"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.UpdatePreset.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdatePreset.Responses.$200>;
  /**
   * deletePreset - Delete a Preset
   *
   * Delete an existing preset.
   */
  "deletePreset"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeletePreset.Responses.$200>;
  /**
   * getRelations - List Relations
   *
   * List the relations.
   */
  "getRelations"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetRelations.Responses.$200>;
  /**
   * createRelation - Create a Relation
   *
   * Create a new relation.
   */
  "createRelation"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateRelation.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateRelation.Responses.$200>;
  /**
   * getRelation - Retrieve a Relation
   *
   * Retrieve a single relation by unique identifier.
   */
  "getRelation"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetRelation.Responses.$200>;
  /**
   * updateRelation - Update a Relation
   *
   * Update an existing relation
   */
  "updateRelation"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.UpdateRelation.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateRelation.Responses.$200>;
  /**
   * deleteRelation - Delete a Relation
   *
   * Delete an existing relation.
   */
  "deleteRelation"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeleteRelation.Responses.$200>;
  /**
   * getRevisions - List Revisions
   *
   * List the revisions.
   */
  "getRevisions"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetRevisions.Responses.$200>;
  /**
   * getRevision - Retrieve a Revision
   *
   * Retrieve a single revision by unique identifier.
   */
  "getRevision"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetRevision.Responses.$200>;
  /**
   * getRoles - List Roles
   *
   * List the roles.
   */
  "getRoles"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetRoles.Responses.$200>;
  /**
   * createRole - Create a Role
   *
   * Create a new role.
   */
  "createRole"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateRole.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateRole.Responses.$200>;
  /**
   * getRole - Retrieve a Role
   *
   * Retrieve a single role by unique identifier.
   */
  "getRole"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetRole.Responses.$200>;
  /**
   * updateRole - Update a Role
   *
   * Update an existing role
   */
  "updateRole"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.UpdateRole.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateRole.Responses.$200>;
  /**
   * deleteRole - Delete a Role
   *
   * Delete an existing role
   */
  "deleteRole"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeleteRole.Responses.$200>;
  /**
   * getSettings - Retrieve Settings
   *
   * List the settings.
   */
  "getSettings"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetSettings.Responses.$200>;
  /**
   * updateSetting - Update Settings
   *
   * Update the settings
   */
  "updateSetting"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.UpdateSetting.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateSetting.Responses.$200>;
  /**
   * getUsers - List Users
   *
   * List the users.
   */
  "getUsers"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetUsers.Responses.$200>;
  /**
   * createUser - Create a User
   *
   * Create a new user.
   */
  "createUser"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateUser.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateUser.Responses.$200>;
  /**
   * getUser - Retrieve a User
   *
   * Retrieve a single user by unique identifier.
   */
  "getUser"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetUser.Responses.$200>;
  /**
   * updateUser - Update a User
   *
   * Update an existing user
   */
  "updateUser"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.UpdateUser.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateUser.Responses.$200>;
  /**
   * deleteUser - Delete a User
   *
   * Delete an existing user
   */
  "deleteUser"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeleteUser.Responses.$200>;
  /**
   * invite - Invite User(s)
   *
   * Invites one or more users to this project. It creates a user with an invited status, and then sends an email to the user with instructions on how to activate their account.
   */
  "invite"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.Invite.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.Invite.Responses.$200>;
  /**
   * acceptInvite - Accept User Invite
   *
   * Accepts and enables an invited user using a JWT invitation token.
   */
  "acceptInvite"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.AcceptInvite.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.AcceptInvite.Responses.$200>;
  /**
   * getMe - Retrieve Current User
   *
   * Retrieve the currently authenticated user.
   */
  "getMe"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetMe.Responses.$200>;
  /**
   * updateMe - Update Current User
   *
   * Update the currently authenticated user.
   */
  "updateMe"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateMe.Responses.$200>;
  /**
   * updateLastUsedPageMe - Update Last Page
   *
   * Updates the last used page field of the currently authenticated user. This is used internally to be able to open the Directus admin app from the last page you used.
   */
  "updateLastUsedPageMe"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.UpdateLastUsedPageMe.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateLastUsedPageMe.Responses.$200>;
  /**
   * meTfaEnable - Enable 2FA
   *
   * Enables two-factor authentication for the currently authenticated user.
   */
  "meTfaEnable"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.MeTfaEnable.Responses.$200>;
  /**
   * meTfaDisable - Disable 2FA
   *
   * Disables two-factor authentication for the currently authenticated user.
   */
  "meTfaDisable"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.MeTfaDisable.Responses.$200>;
  /**
   * getWebhooks - List Webhooks
   *
   * Get all webhooks.
   */
  "getWebhooks"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetWebhooks.Responses.$200>;
  /**
   * createWebhook - Create a Webhook
   *
   * Create a new webhook.
   */
  "createWebhook"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.CreateWebhook.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.CreateWebhook.Responses.$200>;
  /**
   * getWebhook - Retrieve a Webhook
   *
   * Retrieve a single webhook by unique identifier.
   */
  "getWebhook"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.GetWebhook.Responses.$200>;
  /**
   * updateWebhook - Update a Webhook
   *
   * Update an existing webhook
   */
  "updateWebhook"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.UpdateWebhook.RequestBody,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.UpdateWebhook.Responses.$200>;
  /**
   * deleteWebhook - Delete a Webhook
   *
   * Delete an existing webhook
   */
  "deleteWebhook"(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig
  ): OperationResponse<Paths.DeleteWebhook.Responses.$200>;
}

export interface PathsDictionary {
  ["/assets/{id}"]: {
    /**
     * getAsset - Get an Asset
     *
     * Image typed files can be dynamically resized and transformed to fit any need.
     */
    "get"(
      parameters?: Parameters<
        Paths.GetAsset.PathParameters & Paths.GetAsset.QueryParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetAsset.Responses.$200>;
  };
  ["/auth/login"]: {
    /**
     * login - Retrieve a Temporary Access Token
     *
     * Retrieve a Temporary Access Token
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.Login.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.Login.Responses.$200>;
  };
  ["/auth/refresh"]: {
    /**
     * refresh - Refresh Token
     *
     * Refresh a Temporary Access Token.
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.Refresh.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.Refresh.Responses.$200>;
  };
  ["/auth/logout"]: {
    /**
     * logout - Log Out
     *
     * Log Out
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.Logout.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.Logout.Responses.$200>;
  };
  ["/auth/password/request"]: {
    /**
     * passwordRequest - Request a Password Reset
     *
     * Request a reset password email to be send.
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PasswordRequest.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
  };
  ["/auth/password/reset"]: {
    /**
     * passwordReset - Reset a Password
     *
     * The request a password reset endpoint sends an email with a link to the admin app which in turn uses this endpoint to allow the user to reset their password.
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PasswordReset.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
  };
  ["/auth/oauth"]: {
    /**
     * oauth - List OAuth Providers
     *
     * List configured OAuth providers.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.Oauth.Responses.$200>;
  };
  ["/auth/oauth/{provider}"]: {
    /**
     * oauthProvider - Authenticated using an OAuth provider
     *
     * Start OAuth flow using the specified provider
     */
    "get"(
      parameters?: Parameters<
        Paths.OauthProvider.PathParameters & Paths.OauthProvider.QueryParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.OauthProvider.Responses.$200>;
  };
  ["/extensions/interfaces"]: {
    /**
     * getInterfaces - List Interfaces
     *
     * List all installed custom interfaces.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetInterfaces.Responses.$200>;
  };
  ["/extensions/layouts"]: {
    /**
     * getLayouts - List Layouts
     *
     * List all installed custom layouts.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetLayouts.Responses.$200>;
  };
  ["/extensions/displays"]: {
    /**
     * getDisplays - List Displays
     *
     * List all installed custom displays.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetDisplays.Responses.$200>;
  };
  ["/extensions/modules"]: {
    /**
     * getModules - List Modules
     *
     * List all installed custom modules.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetModules.Responses.$200>;
  };
  ["/server/info"]: {
    /**
     * serverInfo - System Info
     *
     * Perform a system status check and return the options.
     */
    "get"(
      parameters?: Parameters<Paths.ServerInfo.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ServerInfo.Responses.$200>;
  };
  ["/server/ping"]: {
    /**
     * ping - Ping
     *
     * Ping, pong. Ping.. pong.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<any>;
  };
  ["/utils/random/string"]: {
    /**
     * random - Get a Random String
     *
     * Returns a random string of given length.
     */
    "get"(
      parameters?: Parameters<Paths.Random.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.Random.Responses.$200>;
  };
  ["/utils/sort/{collection}"]: {
    /**
     * sort - Sort Items
     *
     * Re-sort items in collection based on start and to value of item
     */
    "post"(
      parameters?: Parameters<Paths.Sort.PathParameters> | null,
      data?: Paths.Sort.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.Sort.Responses.$200>;
  };
  ["/items/RealTime"]: {
    /**
     * createItemsRealTime - Create an Item
     *
     * Create a new RealTime item.
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateItemsRealTime.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateItemsRealTime.Responses.$200>;
    /**
     * readItemsRealTime - List Items
     *
     * List the RealTime items.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ReadItemsRealTime.Responses.$200>;
  };
  ["/items/RealTime/{id}"]: {
    /**
     * readSingleItemsRealTime - Retrieve an Item
     *
     * Retrieve a single RealTime item by unique identifier.
     */
    "get"(
      parameters?: Parameters<Paths.ReadSingleItemsRealTime.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ReadSingleItemsRealTime.Responses.$200>;
    /**
     * updateSingleItemsRealTime - Update an Item
     *
     * Update an existing RealTime item.
     */
    "patch"(
      parameters?: Parameters<Paths.UpdateSingleItemsRealTime.PathParameters> | null,
      data?: Paths.UpdateSingleItemsRealTime.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateSingleItemsRealTime.Responses.$200>;
    /**
     * deleteSingleItemsRealTime - Delete an Item
     *
     * Delete an existing RealTime item.
     */
    "delete"(
      parameters?: Parameters<Paths.DeleteSingleItemsRealTime.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteSingleItemsRealTime.Responses.$200>;
  };
  ["/items/agencies"]: {
    /**
     * createItemsAgencies - Create an Item
     *
     * Create a new agencies item.
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateItemsAgencies.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateItemsAgencies.Responses.$200>;
    /**
     * readItemsAgencies - List Items
     *
     * List the agencies items.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ReadItemsAgencies.Responses.$200>;
  };
  ["/items/agencies/{id}"]: {
    /**
     * readSingleItemsAgencies - Retrieve an Item
     *
     * Retrieve a single agencies item by unique identifier.
     */
    "get"(
      parameters?: Parameters<Paths.ReadSingleItemsAgencies.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ReadSingleItemsAgencies.Responses.$200>;
    /**
     * updateSingleItemsAgencies - Update an Item
     *
     * Update an existing agencies item.
     */
    "patch"(
      parameters?: Parameters<Paths.UpdateSingleItemsAgencies.PathParameters> | null,
      data?: Paths.UpdateSingleItemsAgencies.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateSingleItemsAgencies.Responses.$200>;
    /**
     * deleteSingleItemsAgencies - Delete an Item
     *
     * Delete an existing agencies item.
     */
    "delete"(
      parameters?: Parameters<Paths.DeleteSingleItemsAgencies.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteSingleItemsAgencies.Responses.$200>;
  };
  ["/items/calendar"]: {
    /**
     * createItemsCalendar - Create an Item
     *
     * Create a new calendar item.
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateItemsCalendar.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateItemsCalendar.Responses.$200>;
    /**
     * readItemsCalendar - List Items
     *
     * List the calendar items.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ReadItemsCalendar.Responses.$200>;
  };
  ["/items/calendar/{id}"]: {
    /**
     * readSingleItemsCalendar - Retrieve an Item
     *
     * Retrieve a single calendar item by unique identifier.
     */
    "get"(
      parameters?: Parameters<Paths.ReadSingleItemsCalendar.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ReadSingleItemsCalendar.Responses.$200>;
    /**
     * updateSingleItemsCalendar - Update an Item
     *
     * Update an existing calendar item.
     */
    "patch"(
      parameters?: Parameters<Paths.UpdateSingleItemsCalendar.PathParameters> | null,
      data?: Paths.UpdateSingleItemsCalendar.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateSingleItemsCalendar.Responses.$200>;
    /**
     * deleteSingleItemsCalendar - Delete an Item
     *
     * Delete an existing calendar item.
     */
    "delete"(
      parameters?: Parameters<Paths.DeleteSingleItemsCalendar.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteSingleItemsCalendar.Responses.$200>;
  };
  ["/items/routes"]: {
    /**
     * createItemsRoutes - Create an Item
     *
     * Create a new routes item.
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateItemsRoutes.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateItemsRoutes.Responses.$200>;
    /**
     * readItemsRoutes - List Items
     *
     * List the routes items.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ReadItemsRoutes.Responses.$200>;
  };
  ["/items/routes/{id}"]: {
    /**
     * readSingleItemsRoutes - Retrieve an Item
     *
     * Retrieve a single routes item by unique identifier.
     */
    "get"(
      parameters?: Parameters<Paths.ReadSingleItemsRoutes.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ReadSingleItemsRoutes.Responses.$200>;
    /**
     * updateSingleItemsRoutes - Update an Item
     *
     * Update an existing routes item.
     */
    "patch"(
      parameters?: Parameters<Paths.UpdateSingleItemsRoutes.PathParameters> | null,
      data?: Paths.UpdateSingleItemsRoutes.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateSingleItemsRoutes.Responses.$200>;
    /**
     * deleteSingleItemsRoutes - Delete an Item
     *
     * Delete an existing routes item.
     */
    "delete"(
      parameters?: Parameters<Paths.DeleteSingleItemsRoutes.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteSingleItemsRoutes.Responses.$200>;
  };
  ["/items/rt_alert_times"]: {
    /**
     * createItemsRtAlertTimes - Create an Item
     *
     * Create a new rt_alert_times item.
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateItemsRtAlertTimes.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateItemsRtAlertTimes.Responses.$200>;
    /**
     * readItemsRtAlertTimes - List Items
     *
     * List the rt_alert_times items.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ReadItemsRtAlertTimes.Responses.$200>;
  };
  ["/items/rt_alert_times/{id}"]: {
    /**
     * readSingleItemsRtAlertTimes - Retrieve an Item
     *
     * Retrieve a single rt_alert_times item by unique identifier.
     */
    "get"(
      parameters?: Parameters<Paths.ReadSingleItemsRtAlertTimes.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ReadSingleItemsRtAlertTimes.Responses.$200>;
    /**
     * updateSingleItemsRtAlertTimes - Update an Item
     *
     * Update an existing rt_alert_times item.
     */
    "patch"(
      parameters?: Parameters<Paths.UpdateSingleItemsRtAlertTimes.PathParameters> | null,
      data?: Paths.UpdateSingleItemsRtAlertTimes.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateSingleItemsRtAlertTimes.Responses.$200>;
    /**
     * deleteSingleItemsRtAlertTimes - Delete an Item
     *
     * Delete an existing rt_alert_times item.
     */
    "delete"(
      parameters?: Parameters<Paths.DeleteSingleItemsRtAlertTimes.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteSingleItemsRtAlertTimes.Responses.$200>;
  };
  ["/items/rt_alerts"]: {
    /**
     * createItemsRtAlerts - Create an Item
     *
     * Create a new rt_alerts item.
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateItemsRtAlerts.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateItemsRtAlerts.Responses.$200>;
    /**
     * readItemsRtAlerts - List Items
     *
     * List the rt_alerts items.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ReadItemsRtAlerts.Responses.$200>;
  };
  ["/items/rt_alerts/{id}"]: {
    /**
     * readSingleItemsRtAlerts - Retrieve an Item
     *
     * Retrieve a single rt_alerts item by unique identifier.
     */
    "get"(
      parameters?: Parameters<Paths.ReadSingleItemsRtAlerts.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ReadSingleItemsRtAlerts.Responses.$200>;
    /**
     * updateSingleItemsRtAlerts - Update an Item
     *
     * Update an existing rt_alerts item.
     */
    "patch"(
      parameters?: Parameters<Paths.UpdateSingleItemsRtAlerts.PathParameters> | null,
      data?: Paths.UpdateSingleItemsRtAlerts.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateSingleItemsRtAlerts.Responses.$200>;
    /**
     * deleteSingleItemsRtAlerts - Delete an Item
     *
     * Delete an existing rt_alerts item.
     */
    "delete"(
      parameters?: Parameters<Paths.DeleteSingleItemsRtAlerts.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteSingleItemsRtAlerts.Responses.$200>;
  };
  ["/items/rt_stop_time_updates"]: {
    /**
     * createItemsRtStopTimeUpdates - Create an Item
     *
     * Create a new rt_stop_time_updates item.
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateItemsRtStopTimeUpdates.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateItemsRtStopTimeUpdates.Responses.$200>;
    /**
     * readItemsRtStopTimeUpdates - List Items
     *
     * List the rt_stop_time_updates items.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ReadItemsRtStopTimeUpdates.Responses.$200>;
  };
  ["/items/rt_stop_time_updates/{id}"]: {
    /**
     * readSingleItemsRtStopTimeUpdates - Retrieve an Item
     *
     * Retrieve a single rt_stop_time_updates item by unique identifier.
     */
    "get"(
      parameters?: Parameters<Paths.ReadSingleItemsRtStopTimeUpdates.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ReadSingleItemsRtStopTimeUpdates.Responses.$200>;
    /**
     * updateSingleItemsRtStopTimeUpdates - Update an Item
     *
     * Update an existing rt_stop_time_updates item.
     */
    "patch"(
      parameters?: Parameters<Paths.UpdateSingleItemsRtStopTimeUpdates.PathParameters> | null,
      data?: Paths.UpdateSingleItemsRtStopTimeUpdates.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateSingleItemsRtStopTimeUpdates.Responses.$200>;
    /**
     * deleteSingleItemsRtStopTimeUpdates - Delete an Item
     *
     * Delete an existing rt_stop_time_updates item.
     */
    "delete"(
      parameters?: Parameters<Paths.DeleteSingleItemsRtStopTimeUpdates.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteSingleItemsRtStopTimeUpdates.Responses.$200>;
  };
  ["/items/rt_trip_updates"]: {
    /**
     * createItemsRtTripUpdates - Create an Item
     *
     * Create a new rt_trip_updates item.
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateItemsRtTripUpdates.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateItemsRtTripUpdates.Responses.$200>;
    /**
     * readItemsRtTripUpdates - List Items
     *
     * List the rt_trip_updates items.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ReadItemsRtTripUpdates.Responses.$200>;
  };
  ["/items/rt_trip_updates/{id}"]: {
    /**
     * readSingleItemsRtTripUpdates - Retrieve an Item
     *
     * Retrieve a single rt_trip_updates item by unique identifier.
     */
    "get"(
      parameters?: Parameters<Paths.ReadSingleItemsRtTripUpdates.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ReadSingleItemsRtTripUpdates.Responses.$200>;
    /**
     * updateSingleItemsRtTripUpdates - Update an Item
     *
     * Update an existing rt_trip_updates item.
     */
    "patch"(
      parameters?: Parameters<Paths.UpdateSingleItemsRtTripUpdates.PathParameters> | null,
      data?: Paths.UpdateSingleItemsRtTripUpdates.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateSingleItemsRtTripUpdates.Responses.$200>;
    /**
     * deleteSingleItemsRtTripUpdates - Delete an Item
     *
     * Delete an existing rt_trip_updates item.
     */
    "delete"(
      parameters?: Parameters<Paths.DeleteSingleItemsRtTripUpdates.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteSingleItemsRtTripUpdates.Responses.$200>;
  };
  ["/items/shapes"]: {
    /**
     * createItemsShapes - Create an Item
     *
     * Create a new shapes item.
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateItemsShapes.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateItemsShapes.Responses.$200>;
    /**
     * readItemsShapes - List Items
     *
     * List the shapes items.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ReadItemsShapes.Responses.$200>;
  };
  ["/items/shapes/{id}"]: {
    /**
     * readSingleItemsShapes - Retrieve an Item
     *
     * Retrieve a single shapes item by unique identifier.
     */
    "get"(
      parameters?: Parameters<Paths.ReadSingleItemsShapes.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ReadSingleItemsShapes.Responses.$200>;
    /**
     * updateSingleItemsShapes - Update an Item
     *
     * Update an existing shapes item.
     */
    "patch"(
      parameters?: Parameters<Paths.UpdateSingleItemsShapes.PathParameters> | null,
      data?: Paths.UpdateSingleItemsShapes.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateSingleItemsShapes.Responses.$200>;
    /**
     * deleteSingleItemsShapes - Delete an Item
     *
     * Delete an existing shapes item.
     */
    "delete"(
      parameters?: Parameters<Paths.DeleteSingleItemsShapes.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteSingleItemsShapes.Responses.$200>;
  };
  ["/items/stop_times"]: {
    /**
     * createItemsStopTimes - Create an Item
     *
     * Create a new stop_times item.
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateItemsStopTimes.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateItemsStopTimes.Responses.$200>;
    /**
     * readItemsStopTimes - List Items
     *
     * List the stop_times items.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ReadItemsStopTimes.Responses.$200>;
  };
  ["/items/stop_times/{id}"]: {
    /**
     * readSingleItemsStopTimes - Retrieve an Item
     *
     * Retrieve a single stop_times item by unique identifier.
     */
    "get"(
      parameters?: Parameters<Paths.ReadSingleItemsStopTimes.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ReadSingleItemsStopTimes.Responses.$200>;
    /**
     * updateSingleItemsStopTimes - Update an Item
     *
     * Update an existing stop_times item.
     */
    "patch"(
      parameters?: Parameters<Paths.UpdateSingleItemsStopTimes.PathParameters> | null,
      data?: Paths.UpdateSingleItemsStopTimes.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateSingleItemsStopTimes.Responses.$200>;
    /**
     * deleteSingleItemsStopTimes - Delete an Item
     *
     * Delete an existing stop_times item.
     */
    "delete"(
      parameters?: Parameters<Paths.DeleteSingleItemsStopTimes.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteSingleItemsStopTimes.Responses.$200>;
  };
  ["/items/stops"]: {
    /**
     * createItemsStops - Create an Item
     *
     * Create a new stops item.
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateItemsStops.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateItemsStops.Responses.$200>;
    /**
     * readItemsStops - List Items
     *
     * List the stops items.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ReadItemsStops.Responses.$200>;
  };
  ["/items/stops/{id}"]: {
    /**
     * readSingleItemsStops - Retrieve an Item
     *
     * Retrieve a single stops item by unique identifier.
     */
    "get"(
      parameters?: Parameters<Paths.ReadSingleItemsStops.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ReadSingleItemsStops.Responses.$200>;
    /**
     * updateSingleItemsStops - Update an Item
     *
     * Update an existing stops item.
     */
    "patch"(
      parameters?: Parameters<Paths.UpdateSingleItemsStops.PathParameters> | null,
      data?: Paths.UpdateSingleItemsStops.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateSingleItemsStops.Responses.$200>;
    /**
     * deleteSingleItemsStops - Delete an Item
     *
     * Delete an existing stops item.
     */
    "delete"(
      parameters?: Parameters<Paths.DeleteSingleItemsStops.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteSingleItemsStops.Responses.$200>;
  };
  ["/items/tickets"]: {
    /**
     * createItemsTickets - Create an Item
     *
     * Create a new tickets item.
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateItemsTickets.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateItemsTickets.Responses.$200>;
    /**
     * readItemsTickets - List Items
     *
     * List the tickets items.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ReadItemsTickets.Responses.$200>;
  };
  ["/items/tickets/{id}"]: {
    /**
     * readSingleItemsTickets - Retrieve an Item
     *
     * Retrieve a single tickets item by unique identifier.
     */
    "get"(
      parameters?: Parameters<Paths.ReadSingleItemsTickets.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ReadSingleItemsTickets.Responses.$200>;
    /**
     * updateSingleItemsTickets - Update an Item
     *
     * Update an existing tickets item.
     */
    "patch"(
      parameters?: Parameters<Paths.UpdateSingleItemsTickets.PathParameters> | null,
      data?: Paths.UpdateSingleItemsTickets.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateSingleItemsTickets.Responses.$200>;
    /**
     * deleteSingleItemsTickets - Delete an Item
     *
     * Delete an existing tickets item.
     */
    "delete"(
      parameters?: Parameters<Paths.DeleteSingleItemsTickets.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteSingleItemsTickets.Responses.$200>;
  };
  ["/items/trips"]: {
    /**
     * createItemsTrips - Create an Item
     *
     * Create a new trips item.
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateItemsTrips.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateItemsTrips.Responses.$200>;
    /**
     * readItemsTrips - List Items
     *
     * List the trips items.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ReadItemsTrips.Responses.$200>;
  };
  ["/items/trips/{id}"]: {
    /**
     * readSingleItemsTrips - Retrieve an Item
     *
     * Retrieve a single trips item by unique identifier.
     */
    "get"(
      parameters?: Parameters<Paths.ReadSingleItemsTrips.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ReadSingleItemsTrips.Responses.$200>;
    /**
     * updateSingleItemsTrips - Update an Item
     *
     * Update an existing trips item.
     */
    "patch"(
      parameters?: Parameters<Paths.UpdateSingleItemsTrips.PathParameters> | null,
      data?: Paths.UpdateSingleItemsTrips.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateSingleItemsTrips.Responses.$200>;
    /**
     * deleteSingleItemsTrips - Delete an Item
     *
     * Delete an existing trips item.
     */
    "delete"(
      parameters?: Parameters<Paths.DeleteSingleItemsTrips.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteSingleItemsTrips.Responses.$200>;
  };
  ["/items/vehicles"]: {
    /**
     * createItemsVehicles - Create an Item
     *
     * Create a new vehicles item.
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateItemsVehicles.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateItemsVehicles.Responses.$200>;
    /**
     * readItemsVehicles - List Items
     *
     * List the vehicles items.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ReadItemsVehicles.Responses.$200>;
  };
  ["/items/vehicles/{id}"]: {
    /**
     * readSingleItemsVehicles - Retrieve an Item
     *
     * Retrieve a single vehicles item by unique identifier.
     */
    "get"(
      parameters?: Parameters<Paths.ReadSingleItemsVehicles.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.ReadSingleItemsVehicles.Responses.$200>;
    /**
     * updateSingleItemsVehicles - Update an Item
     *
     * Update an existing vehicles item.
     */
    "patch"(
      parameters?: Parameters<Paths.UpdateSingleItemsVehicles.PathParameters> | null,
      data?: Paths.UpdateSingleItemsVehicles.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateSingleItemsVehicles.Responses.$200>;
    /**
     * deleteSingleItemsVehicles - Delete an Item
     *
     * Delete an existing vehicles item.
     */
    "delete"(
      parameters?: Parameters<Paths.DeleteSingleItemsVehicles.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteSingleItemsVehicles.Responses.$200>;
  };
  ["/activity"]: {
    /**
     * getActivities - List Activity Actions
     *
     * Returns a list of activity actions.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetActivities.Responses.$200>;
  };
  ["/activity/comment"]: {
    /**
     * createComment - Create a Comment
     *
     * Creates a new comment.
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateComment.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateComment.Responses.$200>;
  };
  ["/activity/{id}"]: {
    /**
     * getActivity - Retrieve an Activity Action
     *
     * Retrieves the details of an existing activity action. Provide the primary key of the activity action and Directus will return the corresponding information.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetActivity.Responses.$200>;
  };
  ["/activity/comment/{id}"]: {
    /**
     * updateComment - Update a Comment
     *
     * Update the content of an existing comment.
     */
    "patch"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.UpdateComment.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateComment.Responses.$200>;
    /**
     * deleteComment - Delete a Comment
     *
     * Delete an existing comment. Deleted comments can not be retrieved.
     */
    "delete"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteComment.Responses.$203>;
  };
  ["/collections"]: {
    /**
     * getCollections - List Collections
     *
     * Returns a list of the collections available in the project.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetCollections.Responses.$200>;
    /**
     * createCollection - Create a Collection
     *
     * Create a new collection in Directus.
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateCollection.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateCollection.Responses.$200>;
  };
  ["/collections/{id}"]: {
    /**
     * getCollection - Retrieve a Collection
     *
     * Retrieves the details of a single collection.
     */
    "get"(
      parameters?: Parameters<Paths.GetCollection.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetCollection.Responses.$200>;
    /**
     * updateCollection - Update a Collection
     *
     * Update an existing collection.
     */
    "patch"(
      parameters?: Parameters<Paths.UpdateCollection.PathParameters> | null,
      data?: Paths.UpdateCollection.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateCollection.Responses.$200>;
    /**
     * deleteCollection - Delete a Collection
     *
     * Delete an existing collection. Warning: This will delete the whole collection, including the items within. Proceed with caution.
     */
    "delete"(
      parameters?: Parameters<Paths.DeleteCollection.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteCollection.Responses.$200>;
  };
  ["/fields"]: {
    /**
     * getFields - List All Fields
     *
     * Returns a list of the fields available in the project.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetFields.Responses.$200>;
  };
  ["/fields/{collection}"]: {
    /**
     * getCollectionFields - List Fields in Collection
     *
     * Returns a list of the fields available in the given collection.
     */
    "get"(
      parameters?: Parameters<Paths.GetCollectionFields.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetCollectionFields.Responses.$200>;
    /**
     * createField - Create Field in Collection
     *
     * Create a new field in a given collection.
     */
    "post"(
      parameters?: Parameters<Paths.CreateField.PathParameters> | null,
      data?: Paths.CreateField.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateField.Responses.$200>;
  };
  ["/fields/{collection}/{id}"]: {
    /**
     * getCollectionField - Retrieve a Field
     *
     * Retrieves the details of a single field in a given collection.
     */
    "get"(
      parameters?: Parameters<Paths.GetCollectionField.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetCollectionField.Responses.$200>;
    /**
     * updateField - Update a Field
     *
     * Update an existing field.
     */
    "patch"(
      parameters?: Parameters<Paths.UpdateField.PathParameters> | null,
      data?: Paths.UpdateField.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateField.Responses.$200>;
    /**
     * deleteField - Delete a Field
     *
     * Delete an existing field.
     */
    "delete"(
      parameters?: Parameters<Paths.DeleteField.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteField.Responses.$200>;
  };
  ["/files"]: {
    /**
     * getFiles - List Files
     *
     * List the files.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetFiles.Responses.$200>;
    /**
     * createFile - Create a File
     *
     * Create a new file
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateFile.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateFile.Responses.$200>;
  };
  ["/files/{id}"]: {
    /**
     * getFile - Retrieve a Files
     *
     * Retrieve a single file by unique identifier.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetFile.Responses.$200>;
    /**
     * updateFile - Update a File
     *
     * Update an existing file, and/or replace it's file contents.
     */
    "patch"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.UpdateFile.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateFile.Responses.$200>;
    /**
     * deleteFile - Delete a File
     *
     * Delete an existing file.
     */
    "delete"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteFile.Responses.$200>;
  };
  ["/folders"]: {
    /**
     * getFolders - List Folders
     *
     * List the folders.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetFolders.Responses.$200>;
    /**
     * createFolder - Create a Folder
     *
     * Create a new folder.
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateFolder.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateFolder.Responses.$200>;
  };
  ["/folders/{id}"]: {
    /**
     * getFolder - Retrieve a Folder
     *
     * Retrieve a single folder by unique identifier.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetFolder.Responses.$200>;
    /**
     * updateFolder - Update a Folder
     *
     * Update an existing folder
     */
    "patch"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.UpdateFolder.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateFolder.Responses.$200>;
    /**
     * deleteFolder - Delete a Folder
     *
     * Delete an existing folder
     */
    "delete"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteFolder.Responses.$200>;
  };
  ["/permissions"]: {
    /**
     * getPermissions - List Permissions
     *
     * List all permissions.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetPermissions.Responses.$200>;
    /**
     * createPermission - Create a Permission
     *
     * Create a new permission.
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreatePermission.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreatePermission.Responses.$200>;
  };
  ["/permissions/me"]: {
    /**
     * getMyPermissions - List My Permissions
     *
     * List the permissions that apply to the current user.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetMyPermissions.Responses.$200>;
  };
  ["/permissions/{id}"]: {
    /**
     * getPermission - Retrieve a Permission
     *
     * Retrieve a single permissions object by unique identifier.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetPermission.Responses.$200>;
    /**
     * updatePermission - Update a Permission
     *
     * Update an existing permission
     */
    "patch"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.UpdatePermission.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdatePermission.Responses.$200>;
    /**
     * deletePermission - Delete a Permission
     *
     * Delete an existing permission
     */
    "delete"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeletePermission.Responses.$200>;
  };
  ["/presets"]: {
    /**
     * getPresets - List Presets
     *
     * List the presets.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetPresets.Responses.$200>;
    /**
     * createPreset - Create a Preset
     *
     * Create a new preset.
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreatePreset.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreatePreset.Responses.$200>;
  };
  ["/presets/{id}"]: {
    /**
     * getPreset - Retrieve a Preset
     *
     * Retrieve a single preset by unique identifier.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetPreset.Responses.$200>;
    /**
     * updatePreset - Update a Preset
     *
     * Update an existing preset.
     */
    "patch"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.UpdatePreset.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdatePreset.Responses.$200>;
    /**
     * deletePreset - Delete a Preset
     *
     * Delete an existing preset.
     */
    "delete"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeletePreset.Responses.$200>;
  };
  ["/relations"]: {
    /**
     * getRelations - List Relations
     *
     * List the relations.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetRelations.Responses.$200>;
    /**
     * createRelation - Create a Relation
     *
     * Create a new relation.
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateRelation.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateRelation.Responses.$200>;
  };
  ["/relations/{id}"]: {
    /**
     * getRelation - Retrieve a Relation
     *
     * Retrieve a single relation by unique identifier.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetRelation.Responses.$200>;
    /**
     * updateRelation - Update a Relation
     *
     * Update an existing relation
     */
    "patch"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.UpdateRelation.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateRelation.Responses.$200>;
    /**
     * deleteRelation - Delete a Relation
     *
     * Delete an existing relation.
     */
    "delete"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteRelation.Responses.$200>;
  };
  ["/revisions"]: {
    /**
     * getRevisions - List Revisions
     *
     * List the revisions.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetRevisions.Responses.$200>;
  };
  ["/revisions/{id}"]: {
    /**
     * getRevision - Retrieve a Revision
     *
     * Retrieve a single revision by unique identifier.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetRevision.Responses.$200>;
  };
  ["/roles"]: {
    /**
     * getRoles - List Roles
     *
     * List the roles.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetRoles.Responses.$200>;
    /**
     * createRole - Create a Role
     *
     * Create a new role.
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateRole.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateRole.Responses.$200>;
  };
  ["/roles/{id}"]: {
    /**
     * getRole - Retrieve a Role
     *
     * Retrieve a single role by unique identifier.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetRole.Responses.$200>;
    /**
     * updateRole - Update a Role
     *
     * Update an existing role
     */
    "patch"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.UpdateRole.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateRole.Responses.$200>;
    /**
     * deleteRole - Delete a Role
     *
     * Delete an existing role
     */
    "delete"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteRole.Responses.$200>;
  };
  ["/settings"]: {
    /**
     * getSettings - Retrieve Settings
     *
     * List the settings.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetSettings.Responses.$200>;
    /**
     * updateSetting - Update Settings
     *
     * Update the settings
     */
    "patch"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.UpdateSetting.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateSetting.Responses.$200>;
  };
  ["/users"]: {
    /**
     * getUsers - List Users
     *
     * List the users.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetUsers.Responses.$200>;
    /**
     * createUser - Create a User
     *
     * Create a new user.
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateUser.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateUser.Responses.$200>;
  };
  ["/users/{id}"]: {
    /**
     * getUser - Retrieve a User
     *
     * Retrieve a single user by unique identifier.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetUser.Responses.$200>;
    /**
     * updateUser - Update a User
     *
     * Update an existing user
     */
    "patch"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.UpdateUser.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateUser.Responses.$200>;
    /**
     * deleteUser - Delete a User
     *
     * Delete an existing user
     */
    "delete"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteUser.Responses.$200>;
  };
  ["/users/invite"]: {
    /**
     * invite - Invite User(s)
     *
     * Invites one or more users to this project. It creates a user with an invited status, and then sends an email to the user with instructions on how to activate their account.
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.Invite.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.Invite.Responses.$200>;
  };
  ["/users/invite/accept"]: {
    /**
     * acceptInvite - Accept User Invite
     *
     * Accepts and enables an invited user using a JWT invitation token.
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.AcceptInvite.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.AcceptInvite.Responses.$200>;
  };
  ["/users/me"]: {
    /**
     * getMe - Retrieve Current User
     *
     * Retrieve the currently authenticated user.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetMe.Responses.$200>;
    /**
     * updateMe - Update Current User
     *
     * Update the currently authenticated user.
     */
    "patch"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateMe.Responses.$200>;
  };
  ["/users/me/track/page"]: {
    /**
     * updateLastUsedPageMe - Update Last Page
     *
     * Updates the last used page field of the currently authenticated user. This is used internally to be able to open the Directus admin app from the last page you used.
     */
    "patch"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.UpdateLastUsedPageMe.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateLastUsedPageMe.Responses.$200>;
  };
  ["/users/me/tfa/enable"]: {
    /**
     * meTfaEnable - Enable 2FA
     *
     * Enables two-factor authentication for the currently authenticated user.
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.MeTfaEnable.Responses.$200>;
  };
  ["/users/me/tfa/disable"]: {
    /**
     * meTfaDisable - Disable 2FA
     *
     * Disables two-factor authentication for the currently authenticated user.
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.MeTfaDisable.Responses.$200>;
  };
  ["/webhooks"]: {
    /**
     * getWebhooks - List Webhooks
     *
     * Get all webhooks.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetWebhooks.Responses.$200>;
    /**
     * createWebhook - Create a Webhook
     *
     * Create a new webhook.
     */
    "post"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.CreateWebhook.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.CreateWebhook.Responses.$200>;
  };
  ["/webhooks/{id}"]: {
    /**
     * getWebhook - Retrieve a Webhook
     *
     * Retrieve a single webhook by unique identifier.
     */
    "get"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.GetWebhook.Responses.$200>;
    /**
     * updateWebhook - Update a Webhook
     *
     * Update an existing webhook
     */
    "patch"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.UpdateWebhook.RequestBody,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.UpdateWebhook.Responses.$200>;
    /**
     * deleteWebhook - Delete a Webhook
     *
     * Delete an existing webhook
     */
    "delete"(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig
    ): OperationResponse<Paths.DeleteWebhook.Responses.$200>;
  };
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>;
