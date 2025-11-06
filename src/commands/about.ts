import command from '../../config.json' assert {type: 'json'};

const createAbout = (): string[] => {
  const about: string[] = [];
  const SPACE = "&nbsp;";

  const EMAIL = "Email";
  const GITHUB = "Github";
  const LINKEDIN = "Linkedin";
  const X = "X";

  const email = `<i class='fa-solid fa-envelope'></i> ${EMAIL}`;
  const github = `<i class='fa-brands fa-github'></i> ${GITHUB}`;
  const linkedin = `<i class='fa-brands fa-linkedin'></i> ${LINKEDIN}`;
  const xAccount = `<i class='fa-brands fa-x-twitter'></i> ${X}`; // make sure you have the X icon in your fontawesome version

  about.push("<br>");

  command.aboutGreeting.split("\n").forEach(line => {
    if (line.trim() === "") {
      about.push("<br>");
    } else {
      about.push(line);
    }
  });

  about.push("<br>");

  let string = "";
  string += SPACE.repeat(2);
  string += email;
  string += SPACE.repeat(17 - EMAIL.length);
  string += `<a target='_blank' href='mailto:${command.social.email}'>${command.social.email}</a>`;
  about.push(string);

  string = '';
  string += SPACE.repeat(2);
  string += github;
  string += SPACE.repeat(17 - GITHUB.length);
  string += `<a target='_blank' href='https://github.com/${command.social.github}'>github/${command.social.github}</a>`;
  about.push(string);

  string = '';
  string += SPACE.repeat(2);
  string += linkedin;
  string += SPACE.repeat(17 - LINKEDIN.length);
  string += `<a target='_blank' href='https://www.linkedin.com/in/${command.social.linkedin}'>linkedin/${command.social.linkedin}</a>`;
  about.push(string);

  string = '';
  string += SPACE.repeat(2);
  string += xAccount;
  string += SPACE.repeat(17 - X.length);
  string += `<a target='_blank' href='https://x.com/${command.social.x}'>x/${command.social.x}</a>`;
  about.push(string);

  about.push("<br>");
  return about;
};

export const ABOUT = createAbout();
