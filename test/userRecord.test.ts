import {UserRecord} from "../records/user.record";

const simpleUser = {
    name: "Testowy",
    pwd: "testoweHasło"
}

const badUser = {
    name: "Abc",
    pwd: "xxx",
}


test("User return error when bad data are pasted", () => {

    expect(() => {
        new UserRecord(badUser)
    }).toThrowError();

})

test("User properly assign name", () => {

    const user = new UserRecord(simpleUser);

    expect(user.name).toBeTruthy();
    expect(user.name).not.toBeFalsy();
    expect(user.name).toBeDefined();
    expect(user.name).toBe(simpleUser.name);


});

test("User properly assign password", () => {

    const user = new UserRecord(simpleUser);

    expect(user.pwd).toBeTruthy();
    expect(user.pwd).not.toBeFalsy();
    expect(user.pwd).toBeDefined();
    expect(user.pwd).toBe(simpleUser.pwd);


});


test("New user receive id after validation", () => {

    const user = new UserRecord(simpleUser);

    expect(user.id).toBeTruthy();
    expect(user.id).not.toBeFalsy();
    expect(user.id).toBeDefined();


});