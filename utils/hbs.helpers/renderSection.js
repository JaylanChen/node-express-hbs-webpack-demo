module.exports = function (name, block) {
    if (!this.renderSection) {
        this.renderSection = {};
    }
    this.renderSection[name] = block.fn(this);
    return null;
}