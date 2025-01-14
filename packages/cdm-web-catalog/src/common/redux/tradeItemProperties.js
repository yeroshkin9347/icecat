import { combineReducers } from "redux";
import createReducer from "cdm-shared/redux/helpers/createReducer";
import createList from "cdm-shared/redux/helpers/createList";

// export const getTradeItemPropertiesGrouped = () => { return {
// 	"Code": ["ean", "manufacturer_reference", "model_number", "asin"],
// 	"General Informations": ["exclusivity","unit_type","release_date","discontinued_date","licenses","edition","brand","product_line","gender","subject_character","minimum_age","maximum_age"],
//     "Distribution": ["retailers_exclusivity", "product_amazon_launch_date", "reconducted_new_drop", "additional_seasonalities", "availability_period_of_spare_parts"],
//     "Localized information": ["title", "short_title", "short_product_description", "full_product_description", "item_type_name", "product_highlights", "product_components", "notes", "legal_notices", "required_skills_or_characteristics", "care_instructions", "safety_precautions", "hotline"],
// 	"Categories": ["cedemo_category", "gpc_category", "npd_category", "amazon_category"],
// 	"Audience & Gameplay": ["additional_usage", "occasion_type", "additional_audiences", "is_adult_product", "number_of_player_min", "number_of_player_max", "game_duration", "genre_and_similarities", "theme", "style", "special_feature", "developped_capacities"],
// 	"Appearance": ["main_material", "additional_material", "main_color", "additional_colors", "exterior_finish", "item_shape", "frame"],
// 	"Quality & Security": ["certifications_and_norms", "parental_presence", "warning", "cpsia_cautionary_statement", "supplier_declared_dghz_regulation", "hazmat", "safety_data_sheet_url", "ghs", "restriction_description", "telling_page_indicator_proposition_65_california"],
// 	"Warranty": ["warranty_type", "warranty_period_in_month", "warranty_description"],
// 	"Power supply": ["power_supply_type","power_supply_format","number_of_batteries","batteries_provided","standby_autonomy","usage_autonomy","charging_time","power_supply_type_2","power_supply_format_2","number_of_batteries_2","batteries_provided_2","standby_autonomy_2","usage_autonomy_2","charging_time_min_2","power_supply_type_3","power_supply_format_3","number_of_batteries_3","batteries_provided_3","standby_autonomy_3","usage_autonomy_3","charging_time_min_3","power_supply_type_4","power_supply_format_4","number_of_batteries_4","batteries_provided_4","standby_autonomy_4","usage_autonomy_4","charging_time_min_4","battery_cell_composition","battery_weight_value","number_of_lithium_metal_cells","number_of_lithium_ion_cells","lithiumbattery_energy_content_value","lithiumbattery_energy_content_unit","lithiumbattery_packaging","lithiumbattery_weight_value"],
// 	"Building, miniatures & modeling": ["univers", "remote_control_provided", "remore_control_type", "remore_control_range", "axes", "frequency", "scale", "runway_length", "ammo_number", "ammo_range", "engine_type", "digital_proportional", "motor", "tank_fuel_capacity_and_type"],
// 	"Board Games / Cards / Puzzles": ["authors", "number_of_cards", "initial_print_run_rarity", "puzzle_theme", "number_of_pieces_in_the_puzzle", "programs"],
// 	"Doll / Puppet / Plushies": ["functions"],
// 	"Electronics / Musical Toys / Educationnal": ["belt_clip", "software_function", "cable_length", "microphone", "range", "volume_regulation", "wireless", "standby", "parental_control", "wifi", "headphone_type", "alarm_clock", "video_camera_camera", "screens", "audio_characteristics", "hardware", "radio"],
// 	"Kids' Furniture / Decor & Storage": ["modular", "resistance_to_humidity", "additional_information"],
// 	"Imitation / Role playing": ["sizes"],
// 	"Sports / Outdoor Play": ["capacity_volume", "number_of_projectiles", "reach_of_the_projectiles"],
// 	"Coffee / Bar / Table": ["playfield_dimension", "electronic"],
// 	"Vehicle": ["settings", "number_of_gears", "road_off_road", "wheels_size", "frame_size", "stabilizers", "wheels", "saddle_seat_post", "frame_type", "movement_type", "engine_displacement", "engine_displacement_unit", "rail_gauge"],
// 	"Additionnal Fields": ["flash_point_value", "flash_point_unit"],
//     "Plan média": ["media_campaign", "tv_campaign_start_date", "tv_campaign_end_date", "tv_grp_global"],
//     "Miscellaneous": ["hand_orientation", "generic_keyword", "subject_keyword", "is_accessory", "number_of_pieces", "assembly_need", "assembly_time", "packaging_languages", "manual_languages", "fan_count", "channels", "maximum_speed", "difficulty_level", "effects", "gyroscope", "difficulty_level", "effects", "game_language", "game_rules", "tunes", "effects", "game_language", "tunes", "channels", "gyroscope", "effects", "minimum_child_weight", "maximum_child_weight", "tunes", "difficulty_level", "minimum_child_weight", "maximum_child_weight", "game_rules", "game_rules", "maximum_speed", "minimum_child_weight", "maximum_child_weight"],
// }}
export const getTradeItemPropertiesGrouped = () => {
  return {
    additional_audiences: "Audience and Gameplay",
    additional_colors: "Esthetic informations",
    additional_information:
      "Specific fields to Kids' Furniture / Decor & Storage",
    additional_material: "Esthetic informations",
    additional_seasonalities: "Distribution",
    additional_usage: "Audience and Gameplay",
    alarm_clock: "Specific fields to Electronics / Musical Toys / Educationnal",
    amazon_category: "Categorization",
    ammo_number: "Building, miniatures & modeling",
    ammo_range: "Building, miniatures & modeling",
    asin: "Code",
    assembly_need: "Others",
    assembly_time: "Others",
    audio_characteristics:
      "Specific fields to Electronics / Musical Toys / Educationnal",
    authors: "Specific fields to Board Games / Cards / Puzzles",
    availability_period_of_spare_parts: "Distribution",
    axes: "Building, miniatures & modeling",
    batteries_provided: "Power supply",
    batteries_provided_2: "Power supply",
    batteries_provided_3: "Power supply",
    batteries_provided_4: "Power supply",
    battery_cell_composition: "Power supply",
    battery_weight_value: "Power supply",
    belt_clip: "Specific fields to Electronics / Musical Toys / Educationnal",
    brand: "General Informations",
    cable_length:
      "Specific fields to Electronics / Musical Toys / Educationnal",
    capacity_volume: "Specific fields to Sports / Outdoor Play",
    care_instructions: "Common localized fields",
    cedemo_category: "Categorization",
    certifications_and_norms: "Quality & security",
    channels: "Others",
    charging_time: "Power supply",
    charging_time_min_2: "Power supply",
    charging_time_min_3: "Power supply",
    charging_time_min_4: "Power supply",
    cpsia_cautionary_statement: "Quality & security",
    developped_capacities: "Audience and Gameplay",
    difficulty_level: "Others",
    digital_proportional: "Building, miniatures & modeling",
    discontinued_date: "General Informations",
    ean: "Code",
    edition: "General Informations",
    effects: "Others",
    electronic: "Specific fields to Coffee / Bar / Table",
    engine_displacement: "Specific fields to Vehicle",
    engine_displacement_unit: "Specific fields to Vehicle",
    engine_type: "Building, miniatures & modeling",
    exclusivity: "General Informations",
    exterior_finish: "Esthetic informations",
    fan_count: "Others",
    flash_point_unit: "Additionnal Fields",
    flash_point_value: "Additionnal Fields",
    frame: "Esthetic informations",
    frame_size: "Specific fields to Vehicle",
    frame_type: "Specific fields to Vehicle",
    frequency: "Building, miniatures & modeling",
    full_product_description: "Common localized fields",
    functions: "Specific fields to Doll / Puppet / Plushies",
    game_duration: "Audience and Gameplay",
    game_language: "Others",
    game_rules: "Others",
    gender: "Audience and Gameplay",
    generic_keyword: "Others",
    genre_and_similarities: "Audience and Gameplay",
    ghs: "Quality & security",
    gpc_category: "Categorization",
    gyroscope: "Others",
    hand_orientation: "Others",
    hardware: "Specific fields to Electronics / Musical Toys / Educationnal",
    hazmat: "Quality & security",
    headphone_type:
      "Specific fields to Electronics / Musical Toys / Educationnal",
    hotline: "Common localized fields",
    initial_print_run_rarity:
      "Specific fields to Board Games / Cards / Puzzles",
    is_accessory: "Others",
    is_adult_product: "Audience and Gameplay",
    item_shape: "Esthetic informations",
    item_type_name: "Common localized fields",
    legal_notices: "Common localized fields",
    licenses: "General Informations",
    lithiumbattery_energy_content_unit: "Power supply",
    lithiumbattery_energy_content_value: "Power supply",
    lithiumbattery_packaging: "Power supply",
    lithiumbattery_weight_value: "Power supply",
    main_color: "Esthetic informations",
    main_material: "Esthetic informations",
    manual_languages: "Others",
    manufacturer_reference: "Code",
    maximum_age: "Audience and Gameplay",
    maximum_child_weight: "Others",
    maximum_speed: "Others",
    media_campaign: "Plan média",
    microphone: "Specific fields to Electronics / Musical Toys / Educationnal",
    minimum_age: "Audience and Gameplay",
    minimum_child_weight: "Others",
    model_number: "Code",
    modular: "Specific fields to Kids' Furniture / Decor & Storage",
    motor: "Building, miniatures & modeling",
    movement_type: "Specific fields to Vehicle",
    notes: "Common localized fields",
    npd_category: "Categorization",
    number_of_batteries: "Power supply",
    number_of_batteries_2: "Power supply",
    number_of_batteries_3: "Power supply",
    number_of_batteries_4: "Power supply",
    number_of_cards: "Specific fields to Board Games / Cards / Puzzles",
    number_of_gears: "Specific fields to Vehicle",
    number_of_lithium_ion_cells: "Power supply",
    number_of_lithium_metal_cells: "Power supply",
    number_of_pieces: "Others",
    number_of_pieces_in_the_puzzle:
      "Specific fields to Board Games / Cards / Puzzles",
    number_of_player_max: "Audience and Gameplay",
    number_of_player_min: "Audience and Gameplay",
    number_of_projectiles: "Specific fields to Sports / Outdoor Play",
    occasion_type: "Audience and Gameplay",
    packaging_languages: "Others",
    parental_control:
      "Specific fields to Electronics / Musical Toys / Educationnal",
    parental_presence: "Quality & security",
    playfield_dimension: "Specific fields to Coffee / Bar / Table",
    power_supply_format: "Power supply",
    power_supply_format_2: "Power supply",
    power_supply_format_3: "Power supply",
    power_supply_format_4: "Power supply",
    power_supply_type: "Power supply",
    power_supply_type_2: "Power supply",
    power_supply_type_3: "Power supply",
    power_supply_type_4: "Power supply",
    product_amazon_launch_date: "Distribution",
    product_components: "Common localized fields",
    product_highlights: "Common localized fields",
    product_line: "General Informations",
    programs: "Specific fields to Board Games / Cards / Puzzles",
    puzzle_theme: "Specific fields to Board Games / Cards / Puzzles",
    radio: "Specific fields to Electronics / Musical Toys / Educationnal",
    rail_gauge: "Specific fields to Vehicle",
    range: "Specific fields to Electronics / Musical Toys / Educationnal",
    reach_of_the_projectiles: "Specific fields to Sports / Outdoor Play",
    reconducted_new_drop: "Distribution",
    release_date: "General Informations",
    remore_control_range: "Building, miniatures & modeling",
    remore_control_type: "Building, miniatures & modeling",
    remote_control_provided: "Building, miniatures & modeling",
    required_skills_or_characteristics: "Common localized fields",
    resistance_to_humidity:
      "Specific fields to Kids' Furniture / Decor & Storage",
    restriction_description: "Quality & security",
    retailers_exclusivity: "Distribution",
    road_off_road: "Specific fields to Vehicle",
    runway_length: "Building, miniatures & modeling",
    saddle_seat_post: "Specific fields to Vehicle",
    safety_data_sheet_url: "Quality & security",
    safety_precautions: "Common localized fields",
    scale: "Building, miniatures & modeling",
    screens: "Specific fields to Electronics / Musical Toys / Educationnal",
    settings: "Specific fields to Vehicle",
    short_product_description: "Common localized fields",
    short_title: "Common localized fields",
    sizes: "Specific fields to Imitation / Role playing",
    software_function:
      "Specific fields to Electronics / Musical Toys / Educationnal",
    special_feature: "Audience and Gameplay",
    stabilizers: "Specific fields to Vehicle",
    standby: "Specific fields to Electronics / Musical Toys / Educationnal",
    standby_autonomy: "Power supply",
    standby_autonomy_2: "Power supply",
    standby_autonomy_3: "Power supply",
    standby_autonomy_4: "Power supply",
    style: "Audience and Gameplay",
    subject_character: "General Informations",
    subject_keyword: "Others",
    supplier_declared_dghz_regulation: "Quality & security",
    tank_fuel_capacity_and_type: "Building, miniatures & modeling",
    telling_page_indicator_proposition_65_california: "Quality & security",
    theme: "Audience and Gameplay",
    title: "Common localized fields",
    tunes: "Others",
    tv_campaign_end_date: "Plan média",
    tv_campaign_start_date: "Plan média",
    tv_grp_global: "Plan média",
    unit_type: "General Informations",
    univers: "Building, miniatures & modeling",
    usage_autonomy: "Power supply",
    usage_autonomy_2: "Power supply",
    usage_autonomy_3: "Power supply",
    usage_autonomy_4: "Power supply",
    video_camera_camera:
      "Specific fields to Electronics / Musical Toys / Educationnal",
    volume_regulation:
      "Specific fields to Electronics / Musical Toys / Educationnal",
    warning: "Quality & security",
    warranty_description: "Warranty",
    warranty_period_in_month: "Warranty",
    warranty_type: "Warranty",
    wheels: "Specific fields to Vehicle",
    wheels_size: "Specific fields to Vehicle",
    wifi: "Specific fields to Electronics / Musical Toys / Educationnal",
    wireless: "Specific fields to Electronics / Musical Toys / Educationnal"
  };
};

const tradeItemPropertiesListActions = {
  RESET: `MOD_TRADE_ITEM_PROPERTIES_LIST_RESET`,
  REQUEST: `MOD_TRADE_ITEM_PROPERTIES_LIST_REQUEST`,
  SUCCESS: `MOD_TRADE_ITEM_PROPERTIES_LIST_SUCCESS`,
  FAILURE: `MOD_TRADE_ITEM_PROPERTIES_LIST_FAILURE`,
  INVALIDATE: `MOD_TRADE_ITEM_PROPERTIES_LIST_INVALIDATE`,
  REMOVE: `MOD_TRADE_ITEM_PROPERTIES_LIST_REMOVE`
};

const createInstance = combineReducers({
  currentScope: createReducer(null, {
    [`MOD_TRADE_ITEM_PROPERTIES_SET_TRADE_ITEM_CATEGORY_CODE`]: (state, action) => action.tradeItemCategoryCode
  }),
  tradeItemPropertiesGrouped: createReducer(
    getTradeItemPropertiesGrouped(),
    {}
  ),
  tradeItemProperties: createList(tradeItemPropertiesListActions)
});

export default createInstance;
