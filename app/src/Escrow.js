import { useEffect, useState } from "react";

export default function Escrow({
  address,
  arbiter,
  beneficiary,
  value,
  handleApprove,
  disableButton,
}) {
  const [button, setButton] = useState(true);
  useEffect(() => {
    setButton(disableButton);
  }, [disableButton]);
  return (
    <div className="existing-contract">
      <ul className="fields">
        <li>
          <div> Arbiter </div>
          <div> {arbiter} </div>
        </li>
        <li>
          <div> Beneficiary </div>
          <div> {beneficiary} </div>
        </li>
        <li>
          <div> Value </div>
          <div> {value} </div>
        </li>
        {button ? (
          <div
            className="button"
            id={address}
            onClick={(e) => {
              e.preventDefault();

              handleApprove();
            }}
          >
            Approve
          </div>
        ) : (
          <>  </>
        )}
      </ul>
    </div>
  );
}
