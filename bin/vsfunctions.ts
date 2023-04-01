#!/usr/bin/env ts-node

import { io } from "socket.io-client";
import { spawn } from "child_process";
import axios from "axios";
import fs from "fs";

const args = process.argv.slice(2);

const socket = io("http://localhost:5000");

const main = () => {
  socket.emit("join", "ID");

  socket.on("connect", () => {
    console.log("Watching Server For Functions & Types");

    axios
      .post("http://localhost:5000/graphql", {
        query: `
          query {
            getFunction
          }
        `,
      })
      .then((res) => {
        exportFunctionsTypes(res.data.data.getFunction);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  runCommands(args);
};

const runCommands = (args) => {
  const child = spawn(args[0], args.slice(1), {
    stdio: "inherit",
    shell: true,
  });

  child.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });

  child.on("error", (err) => {
    console.log(`child process exited with error ${err}`);
  });

  child.on("exit", (code) => {
    console.log(`child process exited with code ${code}`);
  });

  child.on("disconnect", () => {
    console.log(`child process disconnected`);
  });

  child.on("message", (message) => {
    console.log(`child process message ${message}`);
  });

  child.on("spawn", () => {
    console.log(`child process spawned`);
  });

  child.on("error", (err) => {
    console.log(`child process error ${err}`);
  });

  child.on("exit", (code) => {
    console.log(`child process exited with code ${code}`);
  });
};

const exportFunctionsTypes = (data) => {
  const parsedData = JSON.parse(data);

  const types = parsedData.types;
  const functions = parsedData.functions;

  const typescriptTypes = [];

  // Convert types to TypeScript type declarations
  for (const typeName in types) {
    const type = types[typeName];
    let typeDeclaration = `export type ${typeName} = {\n`;

    for (const fieldName in type) {
      const fieldType = type[fieldName];
      typeDeclaration += `  ${fieldName}: ${fieldType};\n`;
    }

    typeDeclaration += `};\n\n`;

    typescriptTypes.push(typeDeclaration);
  }

  // Extra types
  const KeyValidationType = `type KeyValidation<T> = {
  [K in keyof T]?: T[K] extends object ? KeyValidation<T[K]> : true;
};`;

  typescriptTypes.push(KeyValidationType);

  // Convert functions to TypeScript function declarations
  const typescriptFunctions = [];

  for (const functionName in functions) {
    const functionData = functions[functionName];
    const inputs = [];
    const inputKeys = [];

    // get all inputs and types
    for (const inputName in functionData.input) {
      const inputType = functionData.input[inputName];
      inputs.push(`${inputName}: ${inputType}`);
      inputKeys.push(inputName);
    }

    const outputType = functionData.output;

    const functionDeclaration = `export async function ${functionName}({${inputKeys.map(
      (inp) => inp
    )}}: {${inputs.map((inp) => inp)}}, fields:KeyValidation<${outputType
      .replace("[", "")
      .replace("]", "")}>): Promise<${outputType}> {

    return await handleVSCalls({${inputKeys.map(
      (inp) => inp
    )}}, fields, "${functionName}", "${functionData.fnType}");
  
    }\n\n`;

    typescriptFunctions.push(functionDeclaration);
  }

  // Write TypeScript file
  const typescriptFile = `
import { handleVSCalls } from "vsfunctions";

${typescriptTypes.join("")}
${typescriptFunctions.join("")}
`;

  if (!fs.existsSync("./vsFunc")) {
    // If the folder doesn't exist, create it
    fs.mkdirSync("./vsFunc", { recursive: true });
  }

  fs.writeFileSync("./vsFunc/types.ts", typescriptFile);
};

main();
