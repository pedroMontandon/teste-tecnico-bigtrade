import sinon from 'sinon';
import chai from 'chai';
import chaiHttp from 'chai-http';

import App from '../../../App';
import PostModel from '../../../models/PostModel';
import JwtUtils from '../../../utils/JwtUtils';
import { postWithShortContent, postWithShortTitle, postWithoutContent, postWithoutTitle, rawPost, validPosts } from '../../mocks/postsMocks';
import { decryptedUser } from '../../mocks/usersMocks';

chai.use(chaiHttp);
const { expect } = chai;
const app = new App().app;

const route = '/posts';

describe('post /posts Integration Tests', () => {
  beforeEach(() => { sinon.restore(); });
  after(() => { sinon.restore(); });
  it('should return 201 and a post object', async function () {
    const createStub = sinon.stub(PostModel.prototype, 'create').resolves(validPosts[0]);
    const decodedStub = sinon.stub(JwtUtils.prototype, 'decode').returns(decryptedUser);
    sinon.stub(JwtUtils.prototype, 'verify').returns(decryptedUser);
    const res = await chai.request(app).post(route).set('Authorization', 'valid token').send(rawPost);
    expect(res.status).to.equal(201);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('id');
    expect(res.body.published).to.equal(validPosts[0].published.toISOString());
    expect(res.body.updated).to.equal(validPosts[0].updated.toISOString());
    expect(res.body.title).to.equal(validPosts[0].title);
    expect(res.body.content).to.equal(validPosts[0].content);
    expect(res.body.userId).to.equal(validPosts[0].userId);
    sinon.assert.calledOnce(createStub);
    sinon.assert.calledOnce(decodedStub);
  });

  it('should return 500 if something goes wrong', async function () {
    const decodedStub = sinon.stub(JwtUtils.prototype, 'decode').returns(decryptedUser);
    const createStub = sinon.stub(PostModel.prototype, 'create').throws({ message: 'Internal Server Error' });
    sinon.stub(JwtUtils.prototype, 'verify').returns(decryptedUser);
    const res = await chai.request(app).post(route).set('Authorization', 'valid token').send(validPosts[0]);
    expect(res.status).to.equal(500);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('Internal Server Error');
    sinon.assert.calledOnce(createStub);
  });

  it('should return 400 if no title is provided', async function () {
    const res = await chai.request(app).post(route).set('Authorization', 'valid token').send(postWithoutTitle);
    expect(res.status).to.equal(400);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('Missing required fields');
  });
  it('should return 400 if no content is provided', async function () {
    const res = await chai.request(app).post(route).set('Authorization', 'valid token').send(postWithoutContent);
    expect(res.status).to.equal(400);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('Missing required fields');
  });
  it('should return 400 if title is too short', async function () {
    const res = await chai.request(app).post(route).set('Authorization', 'valid token').send(postWithShortTitle);
    expect(res.status).to.equal(400);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('Invalid title length');
  });
  it('should return 400 if content is too short', async function () {
    const res = await chai.request(app).post(route).set('Authorization', 'valid token').send(postWithShortContent);
    expect(res.status).to.equal(400);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('Invalid content length');
  });
});
