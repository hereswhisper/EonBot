import { Event } from "../utils/index";
import interactionCreate from "./interactionCreate";
import ready from "./ready";

const events: Event<any>[] = [...interactionCreate, ready];

export default events;
