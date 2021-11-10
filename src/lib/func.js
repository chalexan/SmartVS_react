
export const convertEnumSdpTypes = (type) => {
    return type === 1 ? "offer" : type === 2 ? "pranswer" : type === 3 ? "answer" : "rollback"
}

export const convertEnumSdpTypesToNumbers = (type) => {
    return type === "offer" ? 1 : type === "pranswer" ? 2 : type === "answer" ? 3 : 4
}

export const createGuid = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            var r = (Math.random() * 16) | 0,
                v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }
    );
};