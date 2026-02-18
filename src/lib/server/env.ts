import 'dotenv/config';
import z from 'zod';

const EnvSchema = z.object({
    ELEVENLABS_API_KEY: z.string().nonempty("ELEVENLABS_API_KEY is required"),
});

export default EnvSchema.parse(process.env);