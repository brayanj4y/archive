import command from '../../config.json' assert {type: 'json'};

const createProject = (): string[] => {
  let string = "";
  const projects: string[] = [];
  const files = `${command.projects.length} File(s)`;
  const SPACE = "&nbsp;";

  projects.push("<br>")

  command.projects.forEach((ele) => {
    let link = `<a href="${ele[2]}" target="_blank">${ele[0]}</a>`
    string += SPACE.repeat(2);
    string += link;
    string += SPACE.repeat(17 - ele[0].length);

    // Split description by \n and handle line breaks
    const descLines = ele[1].split('\n');
    string += descLines[0];
    projects.push(string);

    // Add remaining lines as separate entries
    for (let i = 1; i < descLines.length; i++) {
      if (descLines[i] === '') {
        projects.push("<br>");
      } else {
        projects.push(SPACE.repeat(19) + descLines[i]);
      }
    }

    string = '';
  });

  projects.push("<br>");
  projects.push(files);
  projects.push("<br>");
  return projects
}

export const PROJECTS = createProject()