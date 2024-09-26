import 'package:equatable/equatable.dart';
import 'package:lm3/src/models/user.dart';

class UserState extends Equatable {
  // const UserState();

  // @override
  // List<Object?> get props => [];

  final UserModel? user;
  final bool isLoading;

  const UserState({this.user, this.isLoading = false});

  UserState copyWith({UserModel? user, bool? isLoading}) {
    return UserState(
      user: user ?? this.user,
      isLoading: isLoading ?? this.isLoading,
    );
  }

  @override
  List<Object?> get props => [];
}

class UserInitial extends UserState {}

class UserLoading extends UserState {}

class UserLoaded extends UserState {
  final UserModel user;

  const UserLoaded(this.user);

  @override
  List<Object?> get props => [user];
}

class UserError extends UserState {
  final String message;

  const UserError(this.message);

  @override
  List<Object?> get props => [message];
}

// class UserLogout extends UserState {}