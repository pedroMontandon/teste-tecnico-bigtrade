import sinon from 'sinon';
import chai from 'chai';
import chaiHttp from 'chai-http';

import App from '../../../App';
import UserModel from '../../../models/UserModel';
import { newValidUser, retrievedUser } from '../../mocks/usersMocks';
import JwtUtils from '../../../utils/JwtUtils';

chai.use(chaiHttp);
const { expect } = chai;
const app = new App().app;

const route = '/users';

describe('put /users/:id Integration Tests', () => {
    beforeEach(() => { sinon.restore(); });
    after(() => { sinon.restore(); });
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
    it('should return 401 if it is not an admin trying to update another user', async function () {
      sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 'another user id', email: retrievedUser.email!, role: 'user' });
      sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 'another user id', email: retrievedUser.email!, role: 'user' });
      sinon.stub(JwtUtils.prototype, 'isAdmin').returns(false);
      const res = await chai.request(app).put(`${route}/${retrievedUser.id}`).set('Authorization', 'admin token').send(newValidUser);
      expect(res.status).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('You are not authorized to update this user');
    });
  });