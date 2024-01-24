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

describe('delete /posts Integration Tests', () => {
  beforeEach(() => { sinon.restore(); });
  it('should return 201 and a post object', async function () {
    const deleteStub = sinon.stub(PostModel.prototype, 'delete').resolves(validPosts[0]);
    const decodedStub = sinon.stub(JwtUtils.prototype, 'decode').returns(decryptedUser);
    sinon.stub(JwtUtils.prototype, 'verify').returns(decryptedUser);
    const res = await chai.request(app).delete(`${route}/${validPosts[0].id}`).set('Authorization', 'valid token').send(rawPost);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('id');
    expect(res.body.published).to.equal(validPosts[0].published.toISOString());
    expect(res.body.updated).to.equal(validPosts[0].updated.toISOString());
    expect(res.body.title).to.equal(validPosts[0].title);
    expect(res.body.content).to.equal(validPosts[0].content);
    expect(res.body.userId).to.equal(validPosts[0].userId);
    sinon.assert.calledOnce(deleteStub);
    sinon.assert.calledOnce(decodedStub);
  });
  it('should return 404 if post is not found', async function () {
    const deleteStub = sinon.stub(PostModel.prototype, 'delete').resolves(null);
    sinon.stub(JwtUtils.prototype, 'decode').returns(decryptedUser);
    sinon.stub(JwtUtils.prototype, 'verify').returns(decryptedUser);
    sinon.stub(JwtUtils.prototype, 'isAdmin').returns(true);
    const res = await chai.request(app).delete(`${route}/${validPosts[0].id}`).set('Authorization', 'valid token').send(rawPost);
    expect(res.status).to.equal(404);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('Post not found');
    sinon.assert.calledOnce(deleteStub);
  });
  it('should return 401 if it is not an admin or the owner of the post', async function () {
    const decodedStub = sinon.stub(JwtUtils.prototype, 'decode').returns({...decryptedUser, id: 'invalid id', role: 'user'});
    sinon.stub(JwtUtils.prototype, 'verify').returns(decryptedUser);
    sinon.stub(JwtUtils.prototype, 'isAdmin').returns(false);
    const res = await chai.request(app).delete(`${route}/${validPosts[0].id}`).set('Authorization', 'valid token').send(validPosts[1]);
    expect(res.status).to.equal(401);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('You are not authorized to delete this post');
  });
});
