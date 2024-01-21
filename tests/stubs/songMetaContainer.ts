import { SongMeta } from "../../src/models/Song";
import { FilledContainerRepos, partialContainer } from "./serviceContainer";
import { filledTitlesRepo, validTitles } from "./titles";

export const partialSongMetaContiner = (additionalRepos: Partial<FilledContainerRepos>) => {

  const repos : Partial<FilledContainerRepos> = {
    titlesRepo: filledTitlesRepo(),
    ...additionalRepos
  };

  return partialContainer(repos);
};

export const validSongMetas = () => {
  const output : SongMeta[] = [];
  for (const [ key, value ] of Object.entries(validTitles)) {
    const index = output.findIndex(x => x.songId == key);
    if (index == -1) output.push(new SongMeta(key, value, [], []));
    else output[index] = new SongMeta(
      key,
      [ ...value, ...output[index].titles ],
      output[index].authors,
      output[index].textAuthors
    );
  }
  return output;
};
