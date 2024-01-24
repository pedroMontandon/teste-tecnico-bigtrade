import sinon from 'sinon';
import chai from 'chai';
import chaiHttp from 'chai-http';

import App from '../../../App';
import UserModel from '../../../models/UserModel';
import { loginCredentials, newValidUser, retrievedUser, userWithInvalidEmail, userWithShortPassword, userWithoutDisplayName, userWithoutEmail, userWithoutPassword } from '../../mocks/usersMocks';
import bcrypt from 'bcryptjs';

chai.use(chaiHttp);
const { expect } = chai;
const app = new App().app;

const route = '/users';

describe('post /users/login Integration Tests', () => {
    beforeEach(() => { sinon.restore(); });
    it('should return 200 and a token', async function () {
      const findByEmailStub = sinon.stub(UserModel.prototype, 'findByEmail').resolves(retrievedUser);
      const compareStub = sinon.stub(bcrypt, 'compareSync').returns(true);
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
    it('should return 400 if email is not registered', async function () {
      const findByEmailStub = sinon.stub(UserModel.prototype, 'findByEmail').resolves(null);
      const res = await chai.request(app).post(`${route}/login`).send(loginCredentials);
      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Invalid email or password');
      sinon.assert.calledOnce(findByEmailStub);
    });
    it('should return 400 if password is incorrect', async function () {
      const findByEmailStub = sinon.stub(UserModel.prototype, 'findByEmail').resolves({...retrievedUser, password: 'wrong password'});
      const compareStub = sinon.stub(bcrypt, 'compareSync').returns(false);
      const res = await chai.request(app).post(`${route}/login`).send(loginCredentials);
      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Invalid email or password');
      sinon.assert.calledOnce(findByEmailStub);
      sinon.assert.calledOnce(compareStub);
    });
  });