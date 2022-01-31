import "@percy/cypress";
import "./commands";
import "@cypress/code-coverage/support";
import { configure } from "@testing-library/cypress";

configure({ testIdAttribute: "data-test-id" });
