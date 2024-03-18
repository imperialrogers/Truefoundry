"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const dotenv = require("dotenv");
const constants_1 = require("./constants");
dotenv.config();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const PORT = process.env.PORT || 8123;
    app.enableCors(constants_1.corsOptions);
    await app.listen(PORT);
}
bootstrap();
//# sourceMappingURL=main.js.map