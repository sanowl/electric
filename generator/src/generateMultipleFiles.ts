import { FileWriter } from './classes';
import { writeArgTypeFiles, writeInputTypeFiles, writeModelFiles } from './functions';
import { CreateOptions } from './types';

export const generateMultipleFiles = ({ dmmf, path }: CreateOptions) => {
  // Create the index file
  const fileWriter = new FileWriter();
  fileWriter.createFile(`${path}/index.ts`, ({ writeExport }) => {
    if (dmmf.generatorConfig.createModelTypes) {
      writeExport('*', './modelSchema');
    }

    writeExport('*', `./${dmmf.generatorConfig.inputTypePath}`);

    if (dmmf.generatorConfig.createInputTypes) {
      writeExport('*', `./${dmmf.generatorConfig.outputTypePath}`);
    }
  });

  // Write model, input type, and argument type files
  writeModelFiles({ path, dmmf });
  writeInputTypeFiles({ path, dmmf });
  writeArgTypeFiles({ path, dmmf });
};
