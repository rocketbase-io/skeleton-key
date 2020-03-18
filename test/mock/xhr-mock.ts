import { config, mock } from "fetch-mock";
config.fallbackToNetwork = true;
mock("foobar", 200);
import "xhr-mock";
