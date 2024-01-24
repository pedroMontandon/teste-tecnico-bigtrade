import sinon from 'sinon';
import chai from 'chai';
import chaiHttp from 'chai-http';

import App from '../../../App';
import PostModel from '../../../models/PostModel';
import { validPosts } from '../../mocks/postsMocks';

chai.use(chaiHttp);
const { expect } = chai;
const app = new App().app;

const route = '/posts';

describe('get /posts Integration Tests', () => {
  beforeEach(() => { sinon.restore(); });
  it('should return 200 and an array of posts', async function () {
    const findAllStub = sinon.stub(PostModel.prototype, 'findAll').resolves(validPosts);
    const res = await chai.request(app).get(route);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.equal(2);
    expect(res.body[0]).to.have.property('id');
    expect(res.body[0]).to.have.property('published');
    expect(res.body[0]).to.have.property('updated');
    expect(res.body[0].title).to.equal(validPosts[0].title);
    expect(res.body[0].content).to.equal(validPosts[0].content);
    expect(res.body[0].userId).to.equal(validPosts[0].userId);

    sinon.assert.calledOnce(findAllStub);
  });

  it('should return 404 if no posts are found', async function () {
    const findAllStub = sinon.stub(PostModel.prototype, 'findAll').resolves([]);
    const res = await chai.request(app).get(route);
    expect(res.status).to.equal(404);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('No posts found');
    sinon.assert.calledOnce(findAllStub);
  });
});

describe('get /posts/:id Integration Tests', () => {
  beforeEach(() => { sinon.restore(); });
  it('should return 200 and a post object', async function () {
    const findByIdStub = sinon.stub(PostModel.prototype, 'findById').resolves(validPosts[0]);
    const res = await chai.request(app).get(`${route}/${validPosts[0].id}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('id');
    expect(res.body.published).to.equal(validPosts[0].published.toISOString());
    expect(res.body.updated).to.equal(validPosts[0].updated.toISOString());
    expect(res.body.title).to.equal(validPosts[0].title);
    expect(res.body.content).to.equal(validPosts[0].content);
    expect(res.body.userId).to.equal(validPosts[0].userId);
    sinon.assert.calledOnce(findByIdStub);
  });

  it('should return 404 if post is not found', async function () {
    const findByIdStub = sinon.stub(PostModel.prototype, 'findById').resolves(null);
    const res = await chai.request(app).get(`${route}/${validPosts[0].id}`);
    expect(res.status).to.equal(404);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message');
    expect(res.body.message).to.equal('Post not found');
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
