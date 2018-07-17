import { configuration } from "@zxnode/base";
import { develVirtualFilesConfiguration, fileConfiguration } from "@zxnode/config";
import * as path from "path";

import ConfigurationLike = configuration.ConfigurationLike;

// Loading configuration
// = Devel config
const conf: ConfigurationLike = develVirtualFilesConfiguration("config", "DEV");
// = PROD config
//const conf: ConfigurationLike = fileConfiguration("config.properties");

// Loding variable with configuration file
const NAME_FORM_CONFIG = conf.getString("NAME");

// Example function with varible
function hello(name: string) {
	console.log(`Hello ${name}`);
}

//Calling a function
hello(NAME_FORM_CONFIG);
