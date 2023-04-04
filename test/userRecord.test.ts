import {UserRecord} from "../records/user.record";
import {db} from "../utils/db";

const simpleUser = {
    login: "Testowy",
    pwd: "testoweHasło"
}

const badUser = {
    login: "Abc",
    pwd: "xxx",
}

const ExistingUser = {
    login: "testowy",
    pwd: "123312213"
}

afterAll(() => {
    db.end()
})

test("User return error when bad data are pasted", () => {

    expect(() => {
        new UserRecord(badUser)
    }).toThrowError();

})

test("User properly assign name", () => {

    const user = new UserRecord(simpleUser);

    expect(user.login).toBeTruthy();
    expect(user.login).not.toBeFalsy();
    expect(user.login).toBeDefined();
    expect(user.login).toBe(simpleUser.login);


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

test("When login already exist in database record should throw error", async () => {

    const user = new UserRecord(ExistingUser)

    const addUser = async () => await user.addUser()

    await expect(addUser()).rejects.toThrowError();


});

test("When searched for non existing login answer should be null ", async () => {
    const user = await UserRecord.findOne("testxxx")

    expect(user).toBeNull()

});

test("When searched for existing login it should return UserRecord ", async () => {
    const user = await UserRecord.findOne("test");

    expect(user).toBeDefined();
    expect(user).toBeInstanceOf(UserRecord);
    expect(user.login).toBe("test");
    expect(user.id).toBeDefined();
    expect(user.pwd).toBeDefined();

})
