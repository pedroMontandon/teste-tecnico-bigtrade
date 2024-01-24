import sinon from 'sinon';
import chai from 'chai';
import chaiHttp from 'chai-http';

import App from '../../../App';
import UserModel from '../../../models/UserModel';
import { retrievedUser } from '../../mocks/usersMocks';
import JwtUtils from '../../../utils/JwtUtils';

chai.use(chaiHttp);
const { expect } = chai;
const app = new App().app;

const route = '/users';


describe('delete /users/:id Integration Tests', () => {
    beforeEach(() => { sinon.restore(); });
    after(() => { sinon.restore(); });
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
    it('should return 401 if the token is invalid', async function () {
      const deleteStub = sinon.stub(UserModel.prototype, 'delete').resolves(retrievedUser);
      sinon.stub(JwtUtils.prototype, 'verify').throws({ message: 'Expired or invalid token' });
      const res = await chai.request(app).delete(`${route}/${retrievedUser.id}`).set('Authorization', 'Expired or invalid token');
      expect(res.status).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Expired or invalid token');
      sinon.assert.notCalled(deleteStub);
    });
    it('should return 401 if the token is missing', async function () {
      const deleteStub = sinon.stub(UserModel.prototype, 'delete').resolves(retrievedUser);
      const res = await chai.request(app).delete(`${route}/${retrievedUser.id}`);
      expect(res.status).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Please, sign in');
      sinon.assert.notCalled(deleteStub);
    });
    it('should return 401 if the user is not an admin and is trying to delete another user', async function () {
      const deleteStub = sinon.stub(UserModel.prototype, 'delete').resolves(retrievedUser);
      sinon.stub(JwtUtils.prototype, 'verify').returns({ id: 'another id', email: retrievedUser.email!, role: 'user' });
      sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 'another id', email: retrievedUser.email!, role: 'user' });
      sinon.stub(JwtUtils.prototype, 'isAdmin').returns(false);
      const res = await chai.request(app).delete(`${route}/${retrievedUser.id}`).set('Authorization', 'user token');
      expect(res.status).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('You are not authorized to delete this user');
      sinon.assert.notCalled(deleteStub);
    });
  });