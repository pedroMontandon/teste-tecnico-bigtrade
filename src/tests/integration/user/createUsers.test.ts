import sinon from 'sinon';
import chai from 'chai';
import chaiHttp from 'chai-http';

import App from '../../../App';
import UserModel from '../../../models/UserModel';
import { newValidUser, retrievedUser, userWithInvalidEmail, userWithInvalidRole, userWithShortPassword, userWithoutDisplayName, userWithoutEmail, userWithoutPassword, userWithoutRole } from '../../mocks/usersMocks';;

chai.use(chaiHttp);
const { expect } = chai;
const app = new App().app;

const route = '/users';

describe('post /users Integration Tests', () => {
  beforeEach(() => { sinon.restore(); });
  after(() => { sinon.restore(); });
  it('should return 201 and a user object', async function () {
    const createStub = sinon.stub(UserModel.prototype, 'create').resolves(retrievedUser);
    const res = await chai.request(app).post(route).send(newValidUser);
    expect(res.status).to.equal(201);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('id');
    expect(res.body.displayName).to.equal(newValidUser.displayName);
    expect(res.body.email).to.equal(newValidUser.email);
    sinon.assert.calledOnce(createStub);
  });
  it('should return 409 if email is already in use', async function () {
    const createStub = sinon.stub(UserModel.prototype, 'create').throws({ code: 11000 });
    const res = await chai.request(app).post(route).send(newValidUser);
    expect(res.status).to.equal(409);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('Email address is already in use by another user.');
    sinon.assert.calledOnce(createStub);
  });
  it('should return 500 if something goes wrong', async function () {
    const createStub = sinon.stub(UserModel.prototype, 'create').throws({ message: 'Internal Server Error' });
    const res = await chai.request(app).post(route).send(newValidUser);
    expect(res.status).to.equal(500);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('Internal Server Error');
    sinon.assert.calledOnce(createStub);
  });
  it('should return 400 if displayName is empty', async function () {
    const res = await chai.request(app).post(route).send(userWithoutDisplayName);
    expect(res.status).to.equal(400);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('Missing required fields');
  });
  it('should return 400 if email is empty', async function () {
    const res = await chai.request(app).post(route).send(userWithoutEmail);
    expect(res.status).to.equal(400);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('Missing required fields');
  });
  it('should return 400 if password is empty', async function () {
    const res = await chai.request(app).post(route).send(userWithoutPassword);
    expect(res.status).to.equal(400);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('Missing required fields');
  });
  it('should return 400 if role is empty', async function () {
    const res = await chai.request(app).post(route).send(userWithoutRole);
    expect(res.status).to.equal(400);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message');
  });
  it('should return 400 if email is invalid', async function () {
    const res = await chai.request(app).post(route).send(userWithInvalidEmail);
    expect(res.status).to.equal(400);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('Invalid email address');
  });
  it('should return 400 if password is too short', async function () {
    const res = await chai.request(app).post(route).send(userWithShortPassword);
    expect(res.status).to.equal(400);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('Password must be at least 6 characters long');
  });
  it('should return 400 if role is invalid', async function () {
    const res = await chai.request(app).post(route).send(userWithInvalidRole);
    expect(res.status).to.equal(400);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message');
  });
});
