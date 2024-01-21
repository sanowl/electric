import { GeneratorOptions } from '@prisma/generator-helper';
import { z } from 'zod';

import { DirectoryHelper, ExtendedDMMF } from './classes';
import { generateMultipleFiles } from './generateMultipleFiles';
import { generateSingleFile } from './generateSingleFile';
import { skipGenerator } from './utils';

export interface GeneratorConfig {
  output: GeneratorOptions['generator']['output'];
  config: GeneratorOptions['generator']['config'];
  dmmf: GeneratorOptions['dmmf'];
  datamodel: string;
}

// Define zod schema for output configuration
const outputSchema = z.object({
  fromEnvVar: z.string().nullable(),
  value: z.string({ required_error: 'No output path specified' }),
});

export const generator = async (config: GeneratorConfig) => {
  // Parse and validate output configuration using zod schema
  const output = outputSchema.parse(config.output);

  // Check if generator should be skipped
  if (await skipGenerator()) {
    return console.log(
      '\x1b[33m',
      '!!!! Generation of zod schemas skipped! Generator is disabled in "zodGenConfig.js" !!!!',
      '\x1b[37m'
    );
  }

  // Extend the DMMF with custom functionality - see "classes" folder
  const extendedDMMF = new ExtendedDMMF(
    config.dmmf,
    config.config,
    config.datamodel
  );

  // If data is present in the output directory, delete it.
  DirectoryHelper.removeDir(output.value);

  // Create the output directory
  DirectoryHelper.createDir(output.value);

  // Generate single or multiple files based on configuration
  if (extendedDMMF.generatorConfig.useMultipleFiles) {
    return generateMultipleFiles({
      dmmf: extendedDMMF,
      path: output.value,
    });
  }

  return generateSingleFile({
    dmmf: extendedDMMF,
    path: output.value,
  });
};
