import express from "express";
import {authMiddleware} from "../middleware/auth-middleware";
import {AuthController} from "../controller/auth-controller";
import {UserController} from "../controller/user-controller";
import {PreferencesController} from "../controller/preferences-controller";
import {LabelController} from "../controller/label-controller";
import {PomodoroSessionController} from "../controller/pomodoro-session-controller";

export const apiRouter = express.Router();
apiRouter.use(authMiddleware);
apiRouter.delete('/auth/logout', AuthController.logout);

// User Endpoint
apiRouter.get('/users/me', UserController.getUsers);
apiRouter.patch('/users/me', UserController.updateUsers);
apiRouter.delete('/users/me', UserController.deleteUsers);
apiRouter.get('/users/setting', UserController.getUserSetting);

// Preferences Endpoint
apiRouter.get('/users/preferences', PreferencesController.getPreferences);
apiRouter.patch('/users/preferences', PreferencesController.updatePreferences);

// Label Endpoint
apiRouter.get('/labels', LabelController.getLabels);
apiRouter.get('/labels/:labelId', LabelController.getLabelById);
apiRouter.post('/labels', LabelController.createLabel);
apiRouter.patch('/labels/:labelId', LabelController.updateLabel);
apiRouter.delete('/labels/:labelId', LabelController.deleteLabel);

// Pomodoro Session Endpoint
apiRouter.post('/session', PomodoroSessionController.createSession);
apiRouter.patch('/session/:sessionId', PomodoroSessionController.updateSession);
