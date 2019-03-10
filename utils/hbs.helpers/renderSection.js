module.exports = function (name, block) {
    if (!this.renderSections) {
        this.renderSections = {};
    }
    this.renderSections[name] = block.fn(this);
    return null;
}