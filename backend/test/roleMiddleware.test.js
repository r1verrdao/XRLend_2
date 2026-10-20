const chai = require("chai");
const sinon = require("sinon");
const { requireRoles } = require("../middleware/roleMiddleware");
const { expect } = chai;

describe("XRH-22 requireRoles(admin) Function Test", () => {
  let res, next;
  const adminOnly = requireRoles("admin");

  beforeEach(() => {
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };
    next = sinon.spy();
  });

  it("should let an admin through", () => {
    adminOnly({ user: { role: "admin" } }, res, next);

    expect(next.calledOnce).to.be.true;
    expect(res.status.called).to.be.false;
  });

  it("should return 403 for a student", () => {
    adminOnly({ user: { role: "student" } }, res, next);

    expect(res.status.calledWith(403)).to.be.true;
    expect(next.called).to.be.false;
  });

  it("should return 403 for a technician", () => {
    adminOnly({ user: { role: "technician" } }, res, next);

    expect(res.status.calledWith(403)).to.be.true;
    expect(next.called).to.be.false;
  });

  it("should return 401 when there is no user on the request", () => {
    adminOnly({}, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(next.called).to.be.false;
  });
});
