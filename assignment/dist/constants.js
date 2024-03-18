"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = exports.GptModels = void 0;
var GptModels;
(function (GptModels) {
    GptModels[GptModels["gpt-3.5-turbo"] = 0] = "gpt-3.5-turbo";
    GptModels[GptModels["gpt-3.5-turbo-1106"] = 1] = "gpt-3.5-turbo-1106";
    GptModels[GptModels["gpt-3.5-turbo-0613"] = 2] = "gpt-3.5-turbo-0613";
    GptModels[GptModels["gpt-3.5-turbo-0301"] = 3] = "gpt-3.5-turbo-0301";
    GptModels[GptModels["gpt-3.5-turbo-0125"] = 4] = "gpt-3.5-turbo-0125";
    GptModels[GptModels["gpt-3.5-turbo-16k"] = 5] = "gpt-3.5-turbo-16k";
    GptModels[GptModels["gpt-3.5-turbo-16k-0613"] = 6] = "gpt-3.5-turbo-16k-0613";
})(GptModels || (exports.GptModels = GptModels = {}));
exports.corsOptions = {
    origin: true
};
//# sourceMappingURL=constants.js.map