import axios from "axios";
export const handleVSCalls = async (fnInput, fields, fnName, fnType) => {
    let fnInputString = "";
    const str = JSON.stringify(fnInput, null, 2);
    fnInputString = stringifyJSON(str);
    fnInputString = removeBrackets(fnInputString);
    if (fnInputString !== "") {
        fnInputString = `(${fnInputString})`;
    }
    else {
        fnInputString = "";
    }
    const queryString = `${fnType} { ${fnName}${fnInputString} ${fields} }`;
    console.log(queryString);
    const { data } = await axios.post("http://localhost:5000/graphql", {
        query: queryString,
    });
    if (data.errors) {
        throw new Error(data.errors[0].message);
    }
    return data.data[fnName];
};
function stringifyJSON(json) {
    const obj = JSON.parse(json);
    function processValue(val) {
        if (typeof val === "object" && val !== null) {
            return stringifyJSON(JSON.stringify(val));
        }
        return JSON.stringify(val);
    }
    if (Array.isArray(obj)) {
        const arrResult = obj.map(processValue);
        return `[${arrResult.join(",")}]`;
    }
    else {
        const objResult = Object.keys(obj).map((key) => `${key.replace(/"/g, "")}:${processValue(obj[key])}`);
        return `{${objResult.join(",")}}`;
    }
}
const removeBrackets = (str) => {
    if (str.startsWith("{") && str.endsWith("}")) {
        str = str.slice(1, -1);
    }
    return str;
};
//# sourceMappingURL=index.js.map