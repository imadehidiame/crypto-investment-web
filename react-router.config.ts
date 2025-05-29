import { type Config } from "@react-router/dev/config";
import 'react-router'

declare module "react-router" {
  interface Future {
    unstable_middleware:true;
  }
}


export default {
  ssr: true,
  prerender:['/about'],
  future: {
    unstable_middleware:true,
  }
} satisfies Config;
