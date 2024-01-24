import { expect } from 'chai';
import JwtUtils from '../../../utils/JwtUtils';

describe('JwtUtils unit tests', () => {
  const jwtUtils = new JwtUtils();

  it('should sign a payload and return a token', () => {
    const payload = { id: '123', email: 'test@example.com', role: 'user' };
    const token = jwtUtils.sign(payload);
    expect(token).to.be.a('string');
  });

  it('should verify a token and return decoded information', () => {
    const payload = { id: '123', email: 'test@example.com', role: 'user' };
    const token = jwtUtils.sign(payload);
    const decoded = jwtUtils.verify(`bearer ${token}`);
    expect(decoded.email).to.equal(payload.email);
    expect(decoded.id).to.equal(payload.id);
    expect(decoded.role).to.equal(payload.role);
  });

  it('should decode a token and return decoded information', () => {
    const payload = { id: '123', email: 'test@example.com', role: 'user' };
    const token = jwtUtils.sign(payload);
    const decoded = jwtUtils.decode(`bearer ${token}`);
    expect(decoded.email).to.equal(payload.email);
    expect(decoded.id).to.equal(payload.id);
    expect(decoded.role).to.equal(payload.role);
  });

  it('should check if a user is an admin based on the token', () => {
    const adminPayload = { id: '123', email: 'admin@example.com', role: 'admin' };
    const adminToken = jwtUtils.sign(adminPayload);

    const userPayload = { id: '456', email: 'user@example.com', role: 'user' };
    const userToken = jwtUtils.sign(userPayload);

    expect(jwtUtils.isAdmin(`bearer ${adminToken}`)).to.be.true;
    expect(jwtUtils.isAdmin(`bearer ${userToken}`)).to.be.false;
  });
});
