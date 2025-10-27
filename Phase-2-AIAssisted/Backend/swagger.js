// swagger.js
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "EQUIPMENT MANAGEMENT API",
			version: "1.0.0",
			description: "API documentation for Equipment Management project",
		},
		servers: [
			{
				url: "http://localhost:5000/api/v1",
				description: "Local server",
			},
		],
	},
	apis: ["./routes/route.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
export { swaggerUi };
