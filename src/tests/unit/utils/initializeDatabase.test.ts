import { expect } from 'chai';
import sinon from 'sinon';
import initializeDatabase from '../../../utils/initializeDatabase';
import UserService from '../../../services/UserService';
import UserModel from '../../../models/UserModel';
import PostModel from '../../../models/PostModel';

describe('initializeDatabase', () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should initialize the database with admin and user data', async () => {
    const userServiceStub = sandbox.stub(UserService.prototype, 'create');
    const userModelStub = sandbox.stub(UserModel.prototype, 'findByEmail').resolves({ id: 'adminId' });
    const postModelStub = sandbox.stub(PostModel.prototype, 'create');

    await initializeDatabase();

    expect(userServiceStub.calledTwice).to.be.true;
    expect(userServiceStub.firstCall.calledWith({ displayName: 'admin', email: 'admin@example.com', password: 'adminPassword', role: 'admin' })).to.be.true;
    expect(userServiceStub.secondCall.calledWith({ displayName: 'user', email: 'user@example.com', password: 'userPassword', role: 'user' })).to.be.true;

    expect(userModelStub.calledTwice).to.be.true;
    expect(userModelStub.firstCall.calledWith('admin@example.com')).to.be.true;
    expect(userModelStub.secondCall.calledWith('user@example.com')).to.be.true;

    expect(postModelStub.calledTwice).to.be.true;
  });
});
