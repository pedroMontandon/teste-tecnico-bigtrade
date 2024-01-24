import sinon from 'sinon';
import chai from 'chai';
import chaiHttp from 'chai-http';

import App from '../../../App';
import PostModel from '../../../models/PostModel';
import JwtUtils from '../../../utils/JwtUtils';
import { postWithShortContent, postWithShortTitle, postWithoutContent, postWithoutTitle, rawPost, validPosts } from '../../mocks/postsMocks';
import { decryptedUser } from '../../mocks/usersMocks';
import { raw } from 'body-parser';

chai.use(chaiHttp);
const { expect } = chai;
const app = new App().app;

const route = '/posts';

describe('put /posts Integration Tests', () => {
  beforeEach(() => { sinon.restore(); });
  it('should return 200 and a post object with updated title', async function () {
    const updateStub = sinon.stub(PostModel.prototype, 'update').resolves(validPosts[0]);
    sinon.stub(JwtUtils.prototype, 'decode').returns(decryptedUser);
    sinon.stub(JwtUtils.prototype, 'verify').returns(decryptedUser);
    sinon.stub(JwtUtils.prototype, 'isAdmin').returns(true);
    const res = await chai.request(app).put(`${route}/${validPosts[0].id}`).set('Authorization', 'valid token').send(rawPost);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    sinon.assert.calledOnce(updateStub);
  });

  it('should return 500 if something goes wrong', async function () {
    const decodedStub = sinon.stub(JwtUtils.prototype, 'decode').returns(decryptedUser);
    const updateStub = sinon.stub(PostModel.prototype, 'update').throws({ message: 'Internal Server Error' });
    sinon.stub(JwtUtils.prototype, 'verify').returns(decryptedUser);
    const res = await chai.request(app).put(`${route}/${validPosts[0].id}`).set('Authorization', 'valid token').send(validPosts[0]);
    expect(res.status).to.equal(500);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('Internal Server Error');
    sinon.assert.calledOnce(updateStub);
    sinon.assert.calledOnce(decodedStub);
  });
  it('should return 401 if it is not an admin or the user who created the post', async function () {
    const decodedStub = sinon.stub(JwtUtils.prototype, 'decode').returns({ id: 'invalid id', role: 'user', email: 'invalid email'});
    sinon.stub(JwtUtils.prototype, 'verify').returns(decryptedUser);
    sinon.stub(JwtUtils.prototype, 'isAdmin').returns(false);
    const res = await chai.request(app).put(`${route}/${validPosts[0].id}`).set('Authorization', 'valid token').send(rawPost);
    expect(res.status).to.equal(401);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('You are not authorized to update this post');
    sinon.assert.calledOnce(decodedStub);
  });
  it('should return 404 if post is not found', async function () {
    const updateStub = sinon.stub(PostModel.prototype, 'update').resolves(null);
    sinon.stub(JwtUtils.prototype, 'decode').returns(decryptedUser);
    sinon.stub(JwtUtils.prototype, 'verify').returns(decryptedUser);
    sinon.stub(JwtUtils.prototype, 'isAdmin').returns(true);
    const res = await chai.request(app).put(`${route}/${validPosts[0].id}`).set('Authorization', 'valid token').send(rawPost);
    expect(res.status).to.equal(404);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('Post not found');
    sinon.assert.calledOnce(updateStub);
  });
});
