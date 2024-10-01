import { Badge } from "@/shared/ui/badge";
import { PinShadowIcon } from "@/shared/ui/icon";

export interface PinProps {
  imageUrl: string;
  alt: string;
  className?: string;
}

const Pin = ({ imageUrl, alt, className = "" }: PinProps) => {
  return (
    <>
      <div
        className={`pin relative flex h-[2.75rem] w-8 items-center justify-center bg-tangerine-500 ${className}`}
      >
        <div className="h-[1.625rem] w-[1.625rem] translate-y-[-0.375rem] rounded-full bg-grey-0">
          <img src={imageUrl} alt={alt} className="h-full w-full rounded-2xl" />
        </div>
      </div>
      <span className="absolute translate-x-[0.25rem] translate-y-[-0.5rem]">
        <PinShadowIcon fill="tangerine-900" />
      </span>
    </>
  );
};

export const Default = ({ imageUrl, alt }: PinProps) => {
  return (
    <div className="relative">
      <Pin imageUrl={imageUrl} alt={alt} />
    </div>
  );
};

export const Multiple = ({
  imageUrl,
  alt,
  markerCount,
}: PinProps & { markerCount: number }) => {
  return (
    <div className="relative">
      <Pin imageUrl={imageUrl} alt={alt} />
      <div className="absolute left-[0.75rem] top-[0.7rem]">
        <Badge colorType="secondary">{`+${Math.min(markerCount, 99)}`}</Badge>
      </div>
    </div>
  );
};

export const Cluster = ({ markerCount }: { markerCount: number }) => {
  return (
    <span className="btn-2 bg-translucent-tangerine flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-full text-center text-tangerine-900">
      {markerCount}
    </span>
  );
};
