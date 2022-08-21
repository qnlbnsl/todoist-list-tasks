import { Projects } from "../types"

export const objectsAreTheSame = (objA: Projects, objB: Projects, isStrict = false): boolean => {
        let areTheSame = true;

        const strictLevel = isStrict ? 'isStrict' : 'isNotStrict';

        const valuesDoNotMatch = {
            'isStrict': (a, b) => a !== b,
            'isNotStrict': (a, b) => a != b
        };

        const isObject = (a, b) => typeof a === 'object' && !Array.isArray(a) && (!!a && !!b);

        const compareArrays = (a, b) => {
            if (a.length === b.length) {
                a.sort();
                b.sort();

                a.forEach((ele, idx) => compareValues(ele, b[idx]));
            } else {
                areTheSame = false;
            }
        };

        const compareValues = (a, b) => {
            if (Array.isArray(a)) {
                compareArrays(a, b);
            } else if (!isObject(a, b) && valuesDoNotMatch[strictLevel](a, b)) {
                areTheSame = false;
            } else if (isObject(a, b) && !objectsAreTheSame(a, b, isStrict)) {
                areTheSame = false;
            }
        };

        const keysA = Object.keys(objA);
        const keysB = Object.keys(objB);

        if (keysA.length !== keysB.length) return false;

        for (const key of keysA) compareValues(objA[key], objB[key]);

        return areTheSame;
    }
