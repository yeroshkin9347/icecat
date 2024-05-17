import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { newUuid } from "../utils/random";

// connected to redux store
// returns [notifications, notify]
// notify({
//  title: "Welcome",
//  body: <html/>,
//  placement: "bottom-center",
//  level: 'success',
//  dismissible: true,
//  dismissAfter: 3000
// })
export default function useNotifications() {
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.notification);

  const notify = useCallback(
    notification => {
      const notificationId = newUuid();
      dispatch({
        type: "CDM_NOTIFICATION_RECEIVED",
        notification: { ...notification, id: notificationId }
      });

      // timeout
      if (notification.dismissAfter) {
        setTimeout(() => {
          dispatch({ type: "CDM_NOTIFICATION_REMOVE", id: notificationId });
        }, notification.dismissAfter);
      }
    },
    [dispatch]
  );

  return [notifications, notify];
}
