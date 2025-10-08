module.exports = {
  types: [
    { types: ["feat", "feature"], label: "🎉 New Features" },
    { types: ["fix", "bugfix"], label: "🐛 Bug Fixes" },
    { types: ["improvements", "enhancement"], label: "🔨 Improvements" },
    { types: ["perf"], label: "🏃‍♂️ Performance" },
    { types: ["build", "ci"], label: "🏗️ Build System" },
    { types: ["refactor"], label: "🎨 Refactors" },
    { types: ["doc", "docs"], label: "📚 Documentation" },
    { types: ["test", "tests"], label: "🔍 Tests" },
    { types: ["style", "styles"], label: "💅 Code Style" },
    { types: ["chore"], label: "🧹 Chore" },
    { types: ["other"], label: "Other" },
  ],

  excludeTypes: ["other"],

  renderTypeSection: function (label, commits) {
    let text = `\n## ${label}\n`;

    commits.forEach((commit) => {
      text += `- ${commit.subject}\n`;
    });

    return text;
  },

  renderChangelog: function (release, changes) {
    const now = new Date();
    return `# ${release} - ${now.toISOString().substr(0, 10)}\n` + changes + "\n\n";
  },
};