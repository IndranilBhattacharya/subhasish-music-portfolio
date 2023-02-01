import { memo, forwardRef } from "react";
import { FCProps } from "../../types";

const MainSectionsWrapper = forwardRef<HTMLElement, FCProps>((props, ref) => {
  return (
    <section className="w-full flex app-section" ref={ref}>
      <div className={`${props.className}`}>{props.children}</div>
      <div className="flex-1"></div>
    </section>
  );
});

MainSectionsWrapper.displayName = "MainSectionsWrapper";

export default memo(MainSectionsWrapper);
