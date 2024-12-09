import { Console } from "@nsnanocat/util";
//import { MESSAGE_TYPE, reflectionMergePartial, BinaryReader, WireType, UnknownFieldHandler, isJsonObject, typeofJsonValue, jsonWriteOptions, MessageType } from "@protobuf-ts/runtime";
import { SiriPegasusRequest } from "../proto/apple/parsec/siri/v2alpha/SiriPegasusRequest";
import { SiriPegasusContext } from "../proto/apple/parsec/siri/v2alpha/SiriPegasusContext";
import { PegasusQueryContext } from "../proto/apple/parsec/search/PegasusQueryContext";
export default class PegasusAPI {
    static Name = "PegasusAPI";
    static Version = "1.0.1";
	static Author = "VirgilClyne";
    static decode(rawBody = new Uint8Array([]), message = "SiriPegasusRequest") {
        Console.log("☑️ PegasusAPI.decode");
        let body = {};
        switch (message) {
            case "SiriPegasusRequest":
                body = SiriPegasusRequest.fromBinary(rawBody);
                break;
            case "SiriPegasusContext":
                body = SiriPegasusContext.fromBinary(rawBody);
                break;
            case "PegasusQueryContext":
                body = PegasusQueryContext.fromBinary(rawBody);
                break;
            default:
                throw new Error(`Unknown message type: ${message}`);
        };
        Console.log("✅ PegasusAPI.decode");
        return body;
    };
    static encode(body = {}, message = "SiriPegasusRequest") {
        Console.log("☑️ PegasusAPI.encode");
        let rawBody = new Uint8Array([]);
        switch (message) {
            case "SiriPegasusRequest":
                rawBody = SiriPegasusRequest.toBinary(body);
                break;
            case "SiriPegasusContext":
                rawBody = SiriPegasusContext.toBinary(body);
                break
            case "PegasusQueryContext":
                rawBody = PegasusQueryContext.toBinary(body);
                break;
            default:
                throw new Error(`Unknown message type: ${message}`);
        };
        Console.log("✅ PegasusAPI.encode");
        return rawBody;
    };
}
