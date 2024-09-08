import { Badge } from "@/shared/ui/badge";
import { PinShadowIcon } from "@/shared/ui/icon";

export interface PinProps {
  imageUrl: string;
  alt?: string;
}

export const Default = ({ imageUrl, alt }: PinProps) => {
  return (
    <div className="pin-wrapper">
      <div className="pin">
        <div className="pin-inner">
          <img src={imageUrl} alt={alt} className="h-full w-full rounded-2xl" />
        </div>
      </div>
      <span className="pin-shadow">
        <PinShadowIcon fill="#BB370C" />
      </span>
    </div>
  );
};

export const Multiple = ({
  imageUrl,
  alt,
  amount,
}: PinProps & { amount: number }) => {
  return (
    <div className="pin-wrapper">
      <div className="pin">
        <div className="pin-inner">
          <img src={imageUrl} alt={alt} className="h-full w-full rounded-2xl" />
        </div>
      </div>
      <div className="pin-shadow">
        <PinShadowIcon fill="#BB370C" />
      </div>
      <div className="pin-amount">
        <Badge colorType="secondary">{`+${Math.min(amount, 99)}`}</Badge>
      </div>
    </div>
  );
};

export const Cluster = ({ amount }: { amount: number }) => {
  return (
    <span className="btn-2 flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-full bg-translucent-tangerine text-center text-tangerine-900">
      {amount}
    </span>
  );
};
