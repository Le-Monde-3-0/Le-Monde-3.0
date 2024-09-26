import 'package:equatable/equatable.dart';
import 'package:lm3/src/models/user.dart';


abstract class UserEvent extends Equatable {
  const UserEvent();

  @override
  List<Object?> get props => [];
}

class UserLogin extends UserEvent {
  final UserModel user;

  const UserLogin(this.user);

  @override
  List<Object?> get props => [user];

  UserModel get getUser => user;
}

class UserLoginRequested extends UserEvent {
  // identifier is either email or username !
  final String identifier;
  final String password;

  UserLoginRequested(this.identifier, this.password);
}

class Login extends UserEvent {
  final String email;
  final String password;

  const Login(this.email, this.password);

  @override
  List<Object?> get props => [email, password];
}

class GetUser extends UserEvent {}

class UserLogout extends UserEvent {}
