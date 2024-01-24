import sinon from 'sinon';
import chai from 'chai';
import chaiHttp from 'chai-http';

import App from '../../../App';
import UserModel from '../../../models/UserModel';
import { retrievedUser } from '../../mocks/usersMocks';

chai.use(chaiHttp);
const { expect } = chai;
const app = new App().app;

const route = '/users';

describe('get /users/:id Integration Tests', () => {
    beforeEach(() => { sinon.restore(); });
    after(() => { sinon.restore(); });
    it('should return 200 and a user object', async function () {
      const findByIdStub = sinon.stub(UserModel.prototype, 'findById').resolves(retrievedUser);
      const res = await chai.request(app).get(`${route}/${retrievedUser.id}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('id');
      expect(res.body.displayName).to.equal(retrievedUser.displayName);
      expect(res.body.email).to.equal(retrievedUser.email);
      sinon.assert.calledOnce(findByIdStub);
    });
    it('should return 404 if user is not found', async function () {
      const findByIdStub = sinon.stub(UserModel.prototype, 'findById').resolves(null);
      const res = await chai.request(app).get(`${route}/${retrievedUser.id}`);
      expect(res.status).to.equal(404);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('User not found');
      sinon.assert.calledOnce(findByIdStub);
    });
    it('should return 400 if id is invalid', async function () {
      const res = await chai.request(app).get(`${route}/invalid_id`);
      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Invalid id');
    });
  });