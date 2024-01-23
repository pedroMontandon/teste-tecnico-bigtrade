import sinon from 'sinon';
import chai from 'chai';
import chaiHttp from 'chai-http';

import App from '../../App';
import UserModel from '../../models/UserModel';
import { loginCredentials, newValidUser, retrievedUser, userWithInvalidEmail, userWithShortPassword, userWithoutDisplayName, userWithoutEmail, userWithoutPassword } from '../mocks/newUserMocks';
import JwtUtils from '../../utils/JwtUtils';
import * as bcrypt from 'bcryptjs';

chai.use(chaiHttp);
const { expect } = chai;
const app = new App().app;

const route = '/users';

describe('post /users Integration Tests', () => {
  beforeEach(() => { sinon.restore(); });
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
});

describe('post /users/login Integration Tests', () => {
  beforeEach(() => { sinon.restore(); });
  it('should return 200 and a token', async function () {
    const findByEmailStub = sinon.stub(UserModel.prototype, 'findByEmail').resolves(retrievedUser);
    const compareStub = sinon.stub(bcrypt, 'compare').resolves(true);
    const res = await chai.request(app).post(`${route}/login`).send(loginCredentials);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('token');
    sinon.assert.calledOnce(findByEmailStub);
    sinon.assert.calledOnce(compareStub);
  });
  it('should return 400 if email is invalid', async function () {
    const res = await chai.request(app).post(`${route}/login`).send({ email: userWithInvalidEmail.email, password: userWithInvalidEmail.password });
    expect(res.status).to.equal(400);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('Invalid email address');
  });
  it('should return 400 if password is too short', async function () {
    const res = await chai.request(app).post(`${route}/login`).send({ email: userWithShortPassword.email, password: userWithShortPassword.password });
    expect(res.status).to.equal(400);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('Password must be at least 6 characters long');
  });
  it('should return 400 if email is empty', async function () {
    const res = await chai.request(app).post(`${route}/login`).send({ email: userWithoutEmail.email, password: userWithoutEmail.password });
    expect(res.status).to.equal(400);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('Missing required fields');
  });
  it('should return 400 if password is empty', async function () {
    const res = await chai.request(app).post(`${route}/login`).send({ email: userWithoutPassword.email, password: userWithoutPassword.password });
    expect(res.status).to.equal(400);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('Missing required fields');
  });
});



describe('put /users/:id Integration Tests', () => {
  beforeEach(() => { sinon.restore(); });
  it('should return 200 and a user object', async function () {
    const findByIdStub = sinon.stub(UserModel.prototype, 'findById').resolves(retrievedUser);
    const updateStub = sinon.stub(UserModel.prototype, 'update').resolves(retrievedUser);
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: retrievedUser.id!, email: retrievedUser.email!, role: retrievedUser.role! });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: retrievedUser.id!, email: retrievedUser.email!, role: retrievedUser.role! });
    sinon.stub(JwtUtils.prototype, 'isAdmin').returns(true);
    const res = await chai.request(app).put(`${route}/${retrievedUser.id}`).set('Authorization', 'admin token').send(newValidUser);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('id');
    expect(res.body.displayName).to.equal(retrievedUser.displayName);
    expect(res.body.email).to.equal(retrievedUser.email);
    sinon.assert.calledOnce(findByIdStub);
    sinon.assert.calledOnce(updateStub);
  });
  it('should return 404 if user is not found', async function () {
    const updateStub = sinon.stub(UserModel.prototype, 'update').resolves(null);
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: retrievedUser.id!, email: retrievedUser.email!, role: retrievedUser.role! });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: retrievedUser.id!, email: retrievedUser.email!, role: retrievedUser.role! });
    sinon.stub(JwtUtils.prototype, 'isAdmin').returns(true);
    const res = await chai.request(app).put(`${route}/${retrievedUser.id}`).set('Authorization', 'admin token').send(newValidUser);
    expect(res.status).to.equal(404);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('User not found');
    sinon.assert.calledOnce(updateStub);
  });
  it('should return 409 if email is already in use', async function () {
    const updateStub = sinon.stub(UserModel.prototype, 'update').throws({ code: 11000 });
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: retrievedUser.id!, email: retrievedUser.email!, role: retrievedUser.role! });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: retrievedUser.id!, email: retrievedUser.email!, role: retrievedUser.role! });
    sinon.stub(JwtUtils.prototype, 'isAdmin').returns(true);
    const res = await chai.request(app).put(`${route}/${retrievedUser.id}`).set('Authorization', 'admin token').send(newValidUser);
    expect(res.status).to.equal(409);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('Email address is already in use by another user.');
    sinon.assert.calledOnce(updateStub);
  });
  it('should return 500 if something goes wrong', async function () {
    const updateStub = sinon.stub(UserModel.prototype, 'update').throws({ message: 'Internal Server Error' });
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: retrievedUser.id!, email: retrievedUser.email!, role: retrievedUser.role! });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: retrievedUser.id!, email: retrievedUser.email!, role: retrievedUser.role! });
    sinon.stub(JwtUtils.prototype, 'isAdmin').returns(true);
    const res = await chai.request(app).put(`${route}/${retrievedUser.id}`).set('Authorization', 'admin token').send(newValidUser);
    expect(res.status).to.equal(500);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('Internal Server Error');
    sinon.assert.calledOnce(updateStub);
  });
});

describe('delete /users/:id Integration Tests', () => {
  beforeEach(() => { sinon.restore(); });
  it('should return 200 and a user object', async function () {
    const deleteStub = sinon.stub(UserModel.prototype, 'delete').resolves(retrievedUser);
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: retrievedUser.id!, email: retrievedUser.email!, role: retrievedUser.role! });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: retrievedUser.id!, email: retrievedUser.email!, role: retrievedUser.role! });
    sinon.stub(JwtUtils.prototype, 'isAdmin').returns(true);
    const res = await chai.request(app).delete(`${route}/${retrievedUser.id}`).set('Authorization', 'admin token');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('id');
    expect(res.body.displayName).to.equal(retrievedUser.displayName);
    expect(res.body.email).to.equal(retrievedUser.email);
    sinon.assert.calledOnce(deleteStub);
  });
  it('should return 404 if user is not found', async function () {
    const deleteStub = sinon.stub(UserModel.prototype, 'delete').resolves(null);
    sinon.stub(JwtUtils.prototype, 'verify').returns({ id: retrievedUser.id!, email: retrievedUser.email!, role: retrievedUser.role! });
    sinon.stub(JwtUtils.prototype, 'decode').returns({ id: retrievedUser.id!, email: retrievedUser.email!, role: retrievedUser.role! });
    sinon.stub(JwtUtils.prototype, 'isAdmin').returns(true);
    const res = await chai.request(app).delete(`${route}/${retrievedUser.id}`).set('Authorization', 'admin token');
    expect(res.status).to.equal(404);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('User not found');
    sinon.assert.calledOnce(deleteStub);
  });
});