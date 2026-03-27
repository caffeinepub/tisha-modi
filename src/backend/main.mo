import Map "mo:core/Map";
import List "mo:core/List";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";

actor {
  // Components
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Photo Gallery Types
  type Photo = {
    title : Text;
    blob : Storage.ExternalBlob;
  };

  module Photo {
    public func compareByTitle(photo1 : Photo, photo2 : Photo) : Order.Order {
      Text.compare(photo1.title, photo2.title);
    };
  };

  let photos = Map.empty<Text, Photo>();

  // Add photo (admin only)
  public shared ({ caller }) func addPhoto(title : Text, blob : Storage.ExternalBlob) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add photos");
    };
    if (photos.containsKey(title)) { Runtime.trap("Photo already exists, please choose a different name") };
    let photo : Photo = {
      title;
      blob;
    };
    photos.add(title, photo);
  };

  // Get all photos (public - no authorization required)
  public query func getAllPhotos() : async [Photo] {
    photos.values().toArray().sort(Photo.compareByTitle);
  };

  // Delete photo (admin only)
  public shared ({ caller }) func deletePhoto(title : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete photos");
    };
    if (not photos.containsKey(title)) { Runtime.trap("Photo not found, please check the name") };
    photos.remove(title);
  };
};
